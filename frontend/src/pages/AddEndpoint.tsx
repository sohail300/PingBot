import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/clerk-react";
import Loading from "@/components/Loading";
import { useNavigate } from "react-router-dom";
import { api } from "@/utils/config";
import { useMutation } from "@tanstack/react-query";
import { displayErrorToast, displaySuccessToast } from "@/utils/toasts";

const AddEndpoint = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isSignedIn) {
    navigate("/login");
  }

  return (
    <div className="bg-[#0e0e10] min-h-screen text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1">Add New Endpoint</h2>
            <p className="text-gray-400">
              Enter the details of the endpoint you want to monitor.
            </p>
          </div>

          {/* Form Card */}
          <AddEndpointForm />
        </motion.div>
      </div>
    </div>
  );
};

const AddEndpointForm = () => {
  const [formData, setFormData] = useState({
    url: "",
    emailNotifications: true,
  });

  const { getToken } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, emailNotifications: checked }));
  };

  const { isPending, mutate } = useMutation({
    mutationFn: handleAddNewEndpoint,
    onSuccess: () =>
      displaySuccessToast({
        title: "Endpoint Added",
        description: "Your new endpoint has been added successfully.",
      }),
    onError: () =>
      displayErrorToast({
        title: "Failed to Add Endpoint",
        description: "Please try again.",
      }),
  });

  async function handleAddNewEndpoint(formData: {
    url: string;
    emailNotifications: boolean;
  }) {
    const token = await getToken();
    const response = await api.post(
      "/target/create",
      {
        url: formData.url,
        send_email: formData.emailNotifications,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }

  return (
    <Card className="bg-[#1a1a1c] border-0 shadow-lg">
      <CardHeader className="pb-4">
        <h3 className="text-lg font-medium text-white">Endpoint Details</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm text-gray-300">
              Endpoint URL
            </Label>
            <Input
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://api.example.com/v1/status"
              className="bg-[#252529] border-gray-700 text-white focus:border-[#00ffae] focus:ring-1 focus:ring-[#00ffae]"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <Label
                htmlFor="emailNotifications"
                className="text-sm text-gray-300 mb-1"
              >
                Email Notifications
              </Label>
              <span className="text-xs text-gray-400">
                Receive alerts when endpoint is down
              </span>
            </div>
            <Switch
              id="emailNotifications"
              checked={formData.emailNotifications}
              onCheckedChange={handleSwitchChange}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#00ffae] data-[state=checked]:to-[#00e0ff]"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto sm:flex-1 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          onClick={() => formData.url.trim() !== "" && mutate(formData)}
          disabled={isPending}
          className="w-full sm:w-auto sm:flex-1 text-black font-medium bg-gradient-to-r from-[#00ffae] to-[#00e0ff] hover:opacity-90 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? "Adding..." : "Add Endpoint"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddEndpoint;
