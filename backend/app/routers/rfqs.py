from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import (
    get_current_user,
    require_buyer,
    require_supplier,
)
from app.models.rfq import RFQ
from app.models.user import User
from app.schemas.rfq import RFQCreate, RFQResponse, RFQUpdate


router = APIRouter(
    prefix="/api/rfqs",
    tags=["RFQs"],
)


# ---------------------------------------------------------
# CREATE RFQ
# ---------------------------------------------------------

@router.post(
    "",
    response_model=RFQResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_rfq(
    data: RFQCreate,
    current_user: User = Depends(require_buyer),
    db: Session = Depends(get_db),
):
    now = datetime.now(timezone.utc)

    if data.deadline <= now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Deadline must be in the future",
        )

    rfq = RFQ(
        buyer_id=current_user.id,
        product_name=data.product_name,
        description=data.description,
        quantity=data.quantity,
        delivery_location=data.delivery_location,
        deadline=data.deadline,
    )

    db.add(rfq)
    db.commit()
    db.refresh(rfq)

    return rfq


# ---------------------------------------------------------
# BROWSE RFQs
# Supplier-facing endpoint
# ---------------------------------------------------------

@router.get(
    "",
    response_model=list[RFQResponse],
)
def list_rfqs(
    search: str | None = Query(
        default=None,
        min_length=1,
        max_length=100,
    ),
    location: str | None = Query(
        default=None,
        min_length=1,
        max_length=100,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    now = datetime.now(timezone.utc)

    query = select(RFQ).where(
        RFQ.deadline > now
    )

    if search:
        search_pattern = f"%{search}%"

        query = query.where(
            or_(
                RFQ.product_name.ilike(search_pattern),
                RFQ.description.ilike(search_pattern),
            )
        )

    if location:
        query = query.where(
            RFQ.delivery_location.ilike(
                f"%{location}%"
            )
        )

    query = query.order_by(
        RFQ.deadline.asc()
    )

    return db.scalars(query).all()


# ---------------------------------------------------------
# GET CURRENT BUYER'S RFQs
# ---------------------------------------------------------

@router.get(
    "/my",
    response_model=list[RFQResponse],
)
def get_my_rfqs(
    current_user: User = Depends(require_buyer),
    db: Session = Depends(get_db),
):
    query = (
        select(RFQ)
        .where(RFQ.buyer_id == current_user.id)
        .order_by(RFQ.created_at.desc())
    )

    return db.scalars(query).all()


# ---------------------------------------------------------
# GET SINGLE RFQ
# ---------------------------------------------------------

@router.get(
    "/{rfq_id}",
    response_model=RFQResponse,
)
def get_rfq(
    rfq_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rfq = db.get(RFQ, rfq_id)

    if rfq is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )

    return rfq


# ---------------------------------------------------------
# UPDATE RFQ
# ---------------------------------------------------------

@router.put(
    "/{rfq_id}",
    response_model=RFQResponse,
)
def update_rfq(
    rfq_id: int,
    data: RFQUpdate,
    current_user: User = Depends(require_buyer),
    db: Session = Depends(get_db),
):
    rfq = db.get(RFQ, rfq_id)

    if rfq is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found",
        )

    # Ownership check
    if rfq.buyer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to modify this RFQ",
        )

    now = datetime.now(timezone.utc)

    if data.deadline is not None and data.deadline <= now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Deadline must be in the future",
        )

    update_data = data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(rfq, field, value)

    db.commit()
    db.refresh(rfq)

    return rfq


# ---------------------------------------------------------
# DELETE RFQ
# ---------------------------------------------------------

@router.delete(
    "/{rfq_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_rfq(
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

    if rfq.buyer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to delete this RFQ",
        )

    db.delete(rfq)
    db.commit()

    return None