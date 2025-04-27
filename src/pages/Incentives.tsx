import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Award, Calendar, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import NavBar from "../components/NavBar";
import { getActivities, getCompletedActivities } from "../services/api";

const Incentives: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [activities, setActivities] = useState([]);
  const [completedActivities, setCompletedActivities] = useState([]);
  const [registered, setRegistered] = useState<string[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesData = await getActivities();
        const completedData = await getCompletedActivities();
        setActivities(activitiesData);
        setCompletedActivities(completedData);
        // Assuming completedData returns activity IDs
        setRegistered(completedData.map((a) => a.id));
      } catch (err) {
        console.error(err);
      }
    };

    fetchActivities();
  }, []);

  const handleRegister = (activityId: string) => {
    if (!registered.includes(activityId)) {
      setRegistered([...registered, activityId]);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen pb-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="bg-primary-600 text-white p-6 pt-16 pb-8">
        <motion.div variants={itemVariants} className="flex items-center">
          <div className="bg-white/20 rounded-full p-3 mr-4">
            <Award size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("incentives.title")}</h1>
            <p className="text-primary-100">
              {t("dashboard.points")}:{" "}
              <span className="font-semibold">120</span>
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="px-6 mt-4 mb-4">
        <div className="flex border-b border-neutral-200">
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "upcoming"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-neutral-500"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            {t("incentives.available")}
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "history"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-neutral-500"
            }`}
            onClick={() => setActiveTab("history")}
          >
            {t("incentives.history")}
          </button>
        </div>
      </motion.div>

      <div className="px-6">
        {activeTab === "upcoming"
          ? activities.map((activity) => (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                className="mb-4"
              >
                <Card className="overflow-hidden p-0">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{activity.name}</h3>
                      <span className="text-sm bg-primary-50 text-primary-700 px-2 py-1 rounded-full flex items-center">
                        <Award size={14} className="mr-1" />
                        {activity.points} {t("incentives.points")}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-neutral-600">
                        <Calendar size={16} className="mr-2 flex-shrink-0" />
                        <span className="text-sm">
                          {new Date(activity.date).toLocaleDateString(
                            undefined,
                            {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center text-neutral-600">
                        <MapPin size={16} className="mr-2 flex-shrink-0" />
                        <span className="text-sm">{activity.location}</span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      {registered.includes(activity.id) ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-success-600 border-success-300"
                          icon={<CheckCircle size={16} />}
                          disabled
                        >
                          Registered
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<ArrowRight size={16} />}
                          onClick={() => handleRegister(activity.id)}
                        >
                          {t("incentives.join")}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          : completedActivities.map((activity) => (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                className="mb-4"
              >
                <Card className="p-4 border-none bg-neutral-50">
                  <div className="flex items-center">
                    <div className="rounded-full bg-success-100 p-3 mr-4">
                      <CheckCircle size={24} className="text-success-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-800">
                        {activity.name}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {new Date(activity.date).toLocaleDateString()} •{" "}
                        {activity.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-sm flex items-center justify-center whitespace-nowrap">
                        <Award size={14} className="mr-1" />
                        {activity.points}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
      </div>

      <NavBar onLogout={() => {}} />
    </motion.div>
  );
};

export default Incentives;
