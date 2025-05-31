"""Add admin field to users table

Revision ID: add_admin_field
Revises: 
Create Date: 2025-01-21 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = 'add_admin_field'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Add is_admin column to users table
    op.add_column('users', sa.Column('is_admin', sa.Boolean(), nullable=False, server_default='0'))

def downgrade():
    # Remove is_admin column from users table
    op.drop_column('users', 'is_admin')
