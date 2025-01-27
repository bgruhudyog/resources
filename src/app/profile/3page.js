// profile/page.js
"use client";
import { useUser } from "../../contexts/UserContext";

export default function ProfilePage() {
  const { user: userData, setUser } = useUser();
  // ... other state declarations ...

  useEffect(() => {
    if (!userData) {
      router.push("/");
      return;
    }

    // Initialize form data from context
    const dob = userData.date_of_birth?.split("-") || [];
    const profileData = {
      fullName: userData.full_name,
      mobile: userData.mobile,
      email: userData.email,
      rank: userData.rank,
      cdcNumber: userData.professional_info?.cdc_number || "",
      // ... other fields ...
    };
    setFormData(profileData);
    setOriginalFormData(profileData);
  }, [userData, router]);

  const updateUserContext = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  // Update all handlers to modify context after successful updates
  const handleNameUpdate = async () => {
    // ... existing update logic ...
    if (!error) {
      updateUserContext({
        full_name: formData.fullName,
        date_of_birth: date_of_birth
      });
    }
  };
  
  // ... rest of the profile page code ...
}