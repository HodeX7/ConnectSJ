import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Home,
  Utensils,
  Heart,
  Briefcase,
  Award,
  Gift,
  LogOut,
  Share2,
} from "lucide-react";

import Button from "../components/Button";
import Card from "../components/Card";
import NavBar from "../components/NavBar";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Get username from localStorage for welcome message
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : { calstateId: "" };

  const resourceCategories = [
    {
      name: t("dashboard.shelter"),
      icon: <Home size={24} className="text-primary-600" />,
      path: "/resources",
      color: "bg-primary-50",
    },
    {
      name: t("dashboard.food"),
      icon: <Utensils size={24} className="text-accent-500" />,
      path: "/resources",
      color: "bg-accent-50",
    },
    {
      name: t("dashboard.health"),
      icon: <Heart size={24} className="text-error-500" />,
      path: "/resources",
      color: "bg-error-50",
    },
    {
      name: t("dashboard.jobs"),
      icon: <Briefcase size={24} className="text-secondary-600" />,
      path: "/jobs",
      color: "bg-secondary-50",
    },
  ];

  const handleLogout = () => {
    onLogout();
    navigate("/login");
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
      <div className="bg-primary-600 text-white p-6 pt-16 rounded-b-3xl">
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-2xl font-bold">{t("dashboard.welcome")}</h1>
          <p className="text-primary-100 text-lg font-medium">
            {user.calstateId}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between mb-2"
        >
          <div>
            <p className="text-sm text-primary-100">{t("dashboard.points")}</p>
            <p className="text-3xl font-bold">120</p>
          </div>
          <div className="flex gap-3 items-center">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => navigate("/incentives")}
              icon={<Award size={18} />}
            >
              {t("dashboard.incentives")}
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => navigate("/rewards")}
              icon={<Gift size={18} />}
            >
              {t("dashboard.rewards")}
            </Button>
            <Share2
              className="cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://connect-sj.vercel.app/ref/${user.calstateid}`
                );
              }}
            />
          </div>
        </motion.div>
      </div>

      <div className="p-6">
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-800 mb-3">
            {t("dashboard.findHelp")}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {resourceCategories.map((category, index) => (
              <motion.div
                key={category.name}
                variants={itemVariants}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`flex flex-col items-center justify-center py-6 ${category.color}`}
                  onClick={() => navigate(category.path)}
                  shadow="sm"
                >
                  <div className="mb-2">{category.icon}</div>
                  <span className="text-neutral-800 font-medium">
                    {category.name}
                  </span>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <Card className="p-4 border-none bg-warning-50">
            <div className="flex items-center">
              <div className="rounded-full bg-warning-100 p-3 mr-4">
                <Award size={24} className="text-warning-600" />
              </div>
              <div>
                <h3 className="font-medium text-neutral-800">
                  Tree Planting Event
                </h3>
                <p className="text-sm text-neutral-600">
                  Earn 50 points this Saturday
                </p>
              </div>
              <Button
                size="sm"
                className="ml-auto"
                variant="secondary"
                onClick={() => navigate("/incentives")}
              >
                View
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            variant="outline"
            className="w-full text-error-600 border-error-300 hover:bg-error-50"
            onClick={handleLogout}
            icon={<LogOut size={18} />}
          >
            {t("dashboard.logout")}
          </Button>
        </motion.div>
      </div>

      <NavBar onLogout={onLogout} />
    </motion.div>
  );
};

export default Dashboard;
