import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Home,
  Utensils,
  Heart,
  Bus,
  Search,
  MapPin,
  Phone,
  Clock,
  Navigation,
} from "lucide-react";

import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import NavBar from "../components/NavBar";
import { getResources } from "../services/api";
import { mockResources } from "../data/mockData";

const Resources: React.FC = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState(mockResources);

  const filters = [
    { id: "all", name: t("resources.nearby"), icon: <MapPin size={18} /> },
    { id: "shelter", name: t("resources.shelters"), icon: <Home size={18} /> },
    { id: "food", name: t("resources.food"), icon: <Utensils size={18} /> },
    {
      id: "healthcare",
      name: t("resources.healthcare"),
      icon: <Heart size={18} />,
    },
    {
      id: "transportation",
      name: t("resources.transportation"),
      icon: <Bus size={18} />,
    },
  ];

  // Filter resources based on active filter and search query
  const filteredResources = resources.filter(
    (resource) =>
      (activeFilter === "all" || resource.type === activeFilter) &&
      (resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getResources();
        console.log(data);
        setResources(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchResources();
  }, []);

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
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold mb-4">{t("resources.title")}</h1>

          <Input
            placeholder={t("common.search")}
            icon={<Search size={18} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/10 border-white/30 text-white placeholder-white/50"
          />
        </motion.div>
      </div>

      <motion.div
        className="px-6 mt-4 mb-6 overflow-x-auto flex gap-2 scrollbar-hide"
        variants={itemVariants}
      >
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter.id)}
            icon={filter.icon}
            className="whitespace-nowrap"
          >
            {filter.name}
          </Button>
        ))}
      </motion.div>

      <div className="px-6">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <motion.div
              key={resource.id}
              variants={itemVariants}
              className="mb-4"
            >
              <Card className="overflow-hidden p-0">
                <div className="h-40 overflow-hidden">
                  <img
                    src={resource.image}
                    alt={resource.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{resource.name}</h3>
                    <span className="text-sm bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
                      {resource.distance}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-neutral-600">
                      <MapPin size={16} className="mr-2 flex-shrink-0" />
                      <span className="text-sm">{resource.address}</span>
                    </div>
                    <div className="flex items-center text-neutral-600">
                      <Phone size={16} className="mr-2 flex-shrink-0" />
                      <span className="text-sm">{resource.phone}</span>
                    </div>
                    <div className="flex items-center text-neutral-600">
                      <Clock size={16} className="mr-2 flex-shrink-0" />
                      <span className="text-sm">{resource.hours}</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Navigation size={16} />}
                      onClick={() =>
                        window.open(
                          `https://maps.google.com/?q=${resource.address}`,
                          "_blank"
                        )
                      }
                    >
                      {t("resources.directions")}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <motion.div
            variants={itemVariants}
            className="text-center py-8 text-neutral-500"
          >
            No resources found. Try a different search or filter.
          </motion.div>
        )}
      </div>

      <NavBar onLogout={() => {}} />
    </motion.div>
  );
};

export default Resources;
