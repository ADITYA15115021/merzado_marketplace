from datetime import datetime

from pydantic import BaseModel, Field


class QuotationCreate(BaseModel):
    quoted_price: float = Field(
        gt=0
    )

    estimated_delivery_time: int = Field(
        gt=0
    )

    message: str | None = Field(
        default=None,
        max_length=5000
    )


class QuotationResponse(BaseModel):
    id: int
    rfq_id: int
    supplier_id: int
    quoted_price: float
    estimated_delivery_time: int
    message: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }