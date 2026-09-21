from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import require_buyer, require_supplier
from app.models.quotation import Quotation
from app.models.rfq import RFQ
from app.models.user import User

from app.schemas.quotation import (
    QuotationCreate,
    QuotationResponse,
)

router = APIRouter(
    prefix="/api",
    tags=["Quotations"],
)


# ---------------------------------------------------------
# SUBMIT QUOTATION
# ---------------------------------------------------------

@router.post(
    "/rfqs/{rfq_id}/quotations",
    response_model=QuotationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_quotation(
    rfq_id: int,
    data: QuotationCreate,
    current_user: User = Depends(require_supplier),
    db: Session = Depends(get_db),
):
    rfq = db.get(RFQ, rfq_id)

    if rfq is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )

    # RFQ deadline check
    now = datetime.now(timezone.utc)

    if rfq.deadline <= now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="RFQ deadline has passed",
        )

    # Prevent duplicate quotation
    existing_quotation = db.scalar(
        select(Quotation).where(
            Quotation.rfq_id == rfq_id,
            Quotation.supplier_id == current_user.id,
        )
    )

    if existing_quotation:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Quotation already submitted for this RFQ",
        )

    quotation = Quotation(
        rfq_id=rfq_id,
        supplier_id=current_user.id,
        quoted_price=data.quoted_price,
        estimated_delivery_time=data.estimated_delivery_time,
        message=data.message,
    )

    db.add(quotation)
    db.commit()
    db.refresh(quotation)

    return quotation


# ---------------------------------------------------------
# BUYER VIEWS QUOTATIONS FOR THEIR RFQ
# ---------------------------------------------------------

@router.get(
    "/rfqs/{rfq_id}/quotations",
    response_model=list[QuotationResponse],
)
def get_rfq_quotations(
    rfq_id: int,
    current_user: User = Depends(require_buyer),
    db: Session = Depends(get_db),
):
    rfq = db.get(RFQ, rfq_id)

    if rfq is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )

    # Only the owner can see received quotations
    if rfq.buyer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to view these quotations",
        )

    query = (
        select(Quotation)
        .where(Quotation.rfq_id == rfq_id)
        .order_by(Quotation.created_at.asc())
    )

    return db.scalars(query).all()


# ---------------------------------------------------------
# SUPPLIER VIEWS THEIR SUBMITTED QUOTATIONS
# ---------------------------------------------------------

@router.get(
    "/quotations/my",
    response_model=list[QuotationResponse],
)
def get_my_quotations(
    current_user: User = Depends(require_supplier),
    db: Session = Depends(get_db),
):
    query = (
        select(Quotation)
        .where(
            Quotation.supplier_id == current_user.id
        )
        .order_by(Quotation.created_at.desc())
    )

    return db.scalars(query).all()