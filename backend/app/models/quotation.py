from datetime import datetime, timezone

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Quotation(Base):
    __tablename__ = "quotations"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    rfq_id: Mapped[int] = mapped_column(
        ForeignKey(
            "rfqs.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    supplier_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    quoted_price: Mapped[float] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    # Number of days
    estimated_delivery_time: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Quotation → RFQ
    rfq: Mapped["RFQ"] = relationship(
        "RFQ",
        back_populates="quotations",
    )

    # Quotation → Supplier
    supplier: Mapped["User"] = relationship(
        "User",
        back_populates="quotations",
    )

    # A supplier can submit only one quotation for an RFQ
    __table_args__ = (
        UniqueConstraint(
            "rfq_id",
            "supplier_id",
            name="uq_rfq_supplier",
        ),
    )