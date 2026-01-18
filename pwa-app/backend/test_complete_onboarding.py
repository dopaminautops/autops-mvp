from models.database import SessionLocal, Booking
from datetime import datetime, timedelta

def test_complete_onboarding():
    """
        Test the complete customer onboarding workflow
            """
                db = SessionLocal()
                    
                        print("🧪 Testing Complete Customer Onboarding Workflow...")
                            
                                # Step 1: Create a booking (simulating a new customer)
                                    print("\n📝 Step 1: Creating booking for new customer...")
                                        booking = Booking(
                                                transcription_id=None,  # Can be None for manual booking
                                                        customer_name="Test Customer",
                                                                customer_phone="+15551112222",
                                                                        booking_date=datetime.utcnow() + timedelta(days=2, hours=14),
                                                                                service_type="Home Service",
                                                                                        status="confirmed",
                                                                                                confidence_score=1.0
                                                                                                    )
                                                                                                        db.add(booking)
                                                                                                            db.commit()
                                                                                                                db.refresh(booking)
                                                                                                                    print(f"✅ Booking created: ID={booking.id}, Customer={booking.customer_name}")
                                                                                                                        
                                                                                                                            # Step 2: Trigger onboarding flow
                                                                                                                                print("\n🔄 Step 2: Triggering onboarding flow...")
                                                                                                                                    
                                                                                                                                        import requests
                                                                                                                                            response = requests.post(
                                                                                                                                                    f'http://localhost:8000/api/customer-onboarding/flows/1/execute',
                                                                                                                                                            params={'booking_id': booking.id}
                                                                                                                                                                )
                                                                                                                                                                    
                                                                                                                                                                        if response.status_code == 200:
                                                                                                                                                                                data = response.json()
                                                                                                                                                                                        print(f"✅ Onboarding flow started!")
                                                                                                                                                                                                print(f"   Execution ID: {data['execution_id']}")
                                                                                                                                                                                                        print(f"   Flow: {data['flow_name']}")
                                                                                                                                                                                                                print(f"   Customer: {data['customer_name']}")
                                                                                                                                                                                                                    else:
                                                                                                                                                                                                                            print(f"❌ Failed to start flow: {response.text}")
                                                                                                                                                                                                                                
                                                                                                                                                                                                                                    # Step 3: Check execution status
                                                                                                                                                                                                                                        if response.status_code == 200:
                                                                                                                                                                                                                                                execution_id = data['execution_id']
                                                                                                                                                                                                                                                        print(f"\n📊 Step 3: Checking execution status...")
                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                        status_response = requests.get(
                                                                                                                                                                                                                                                                                    f'http://localhost:8000/api/customer-onboarding/executions/{execution_id}'
                                                                                                                                                                                                                                                                                            )
                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                            if status_response.status_code == 200:
                                                                                                                                                                                                                                                                                                                        status_data = status_response.json()
                                                                                                                                                                                                                                                                                                                                    print(f"✅ Execution Status:")
                                                                                                                                                                                                                                                                                                                                                print(f"   Status: {status_data['status']}")
                                                                                                                                                                                                                                                                                                                                                            print(f"   Current Step: {status_data['current_step']}")
                                                                                                                                                                                                                                                                                                                                                                        print(f"   Started: {status_data['started_at']}")
                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                print("\n🎉 Complete Customer Onboarding Test Finished!")
                                                                                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                        db.close()

                                                                                                                                                                                                                                                                                                                                                                                        if __name__ == "__main__":
                                                                                                                                                                                                                                                                                                                                                                                            test_complete_onboarding()