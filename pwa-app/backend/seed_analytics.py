# backend/seed_analytics.py
from sqlalchemy.orm import sessionmaker
from model.database import engine, AutomationAnalytics

Session = sessionmaker(bind=engine)
session = Session()

if not session.query(AutomationAnalytics).first():
    sample_data = [
            AutomationAnalytics(
                        period="2026-W24",
                                    revenue=847392.00,
                                                expenses=234567.00,
                                                            profit=612825.00,
                                                                        project_completion=94.00,
                                                                                    team_utilization=87.00,
                                                                                                customer_satisfaction=4.80,
                                                                                                            active_tasks=156,
                                                                                                                        ai_insight="Revenue trending 15% above forecast. Consider increasing Q4 targets."
                                                                                                                                ),
                                                                                                                                        AutomationAnalytics(
                                                                                                                                                    period="2026-W23",
                                                                                                                                                                revenue=820000.00,
                                                                                                                                                                            expenses=240000.00,
                                                                                                                                                                                        profit=580000.00,
                                                                                                                                                                                                    project_completion=92.00,
                                                                                                                                                                                                                team_utilization=85.00,
                                                                                                                                                                                                                            customer_satisfaction=4.75,
                                                                                                                                                                                                                                        active_tasks=160,
                                                                                                                                                                                                                                                    ai_insight="Customer satisfaction improving. Maintain current workflow."
                                                                                                                                                                                                                                                            ),
                                                                                                                                                                                                                                                                ]
                                                                                                                                                                                                                                                                    session.add_all(sample_data)
                                                                                                                                                                                                                                                                        session.commit()
                                                                                                                                                                                                                                                                            print("✅ Automation analytics data seeded.")
                                                                                                                                                                                                                                                                            else:
                                                                                                                                                                                                                                                                                print("ℹ️ Automation analytics data already exists.")

                                                                                                                                                                                                                                                                                session.close()