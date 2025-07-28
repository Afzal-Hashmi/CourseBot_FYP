"""updated the ENUM for Content

Revision ID: c2a36586c4b4
Revises: 0fe630f31e20
Create Date: 2025-07-27 01:30:25.201775
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'c2a36586c4b4'
down_revision: Union[str, None] = '0fe630f31e20'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Rename the old enum
    op.execute("ALTER TYPE content_type_enum RENAME TO content_type_enum_old;")

    # Create the new enum with updated values
    op.execute("""
        CREATE TYPE content_type_enum AS ENUM ('video', 'pdf', 'docx', 'pptx');
    """)

    # Alter the column to use the new enum
    op.execute("""
        ALTER TABLE course_content
        ALTER COLUMN content_type
        TYPE content_type_enum
        USING content_type::text::content_type_enum;
    """)

    # Drop the old enum
    op.execute("DROP TYPE content_type_enum_old;")


def downgrade() -> None:
    # Reverse to the old enum
    op.execute("ALTER TYPE content_type_enum RENAME TO content_type_enum_new;")

    op.execute("""
        CREATE TYPE content_type_enum AS ENUM ('video', 'pdf', 'txt', 'ppt');
    """)

    op.execute("""
        ALTER TABLE course_content
        ALTER COLUMN content_type
        TYPE content_type_enum
        USING content_type::text::content_type_enum;
    """)

    op.execute("DROP TYPE content_type_enum_new;")
