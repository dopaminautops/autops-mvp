# backend/seed_finance.py
from sqlalchemy.orm import sessionmaker
from model.database import engine, FinancialSummary

Session = sessionmaker(bind=engine)
session = Session()

# Check if data already exists
if not session.query(FinancialSummary).first():
    sample_data = [
            FinancialSummary(period='2026-Q1', revenue=150000.00, expenses=80000.00, profit=70000.00),
                    FinancialSummary(period='2025-Q4', revenue=130000.00, expenses=75000.00, profit=55000.00),
                            FinancialSummary(period='2025-Q3', revenue=120000.00, expenses=70000.00, profit=50000.00),
                                ]
                                    session.add_all(sample_data)
                                        session.commit()
                                            print("✅ Finance data seeded.")
                                            else:
                                                print("ℹ️ Finance data already exists.")

                                                session.close()