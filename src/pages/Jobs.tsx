import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Building, Clock, DollarSign } from "lucide-react";

import Button from "../components/Button";
import Card from "../components/Card";
import NavBar from "../components/NavBar";

// Import mock data
import { mockJobs } from "../data/mockData";
import { getJobs } from "../services/api";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string;
};

const Jobs: React.FC = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Uncomment the following when API is ready
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const jobs = await getJobs(); // type: { id: string }[]
        console.log(jobs);
        setJobs(jobs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [filter]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-600">{t("common.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-error-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            {t("common.retry")}
          </Button>
        </div>
      </div>
    );
  }

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
            <Briefcase size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("jobs.title")}</h1>
            <p className="text-primary-100">{t("jobs.available")}</p>
          </div>
        </motion.div>
      </div>

      <div className="px-6 py-4">
        <motion.div
          variants={itemVariants}
          className="flex gap-2 mb-6 overflow-x-auto"
        >
          <Button
            variant={filter === "all" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Jobs
          </Button>
          <Button
            variant={filter === "fulltime" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("fulltime")}
          >
            Full Time
          </Button>
          <Button
            variant={filter === "parttime" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("parttime")}
          >
            Part Time
          </Button>
        </motion.div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <motion.div key={job.id} variants={itemVariants}>
              <Card className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800">
                      {job.title}
                    </h3>
                    <div className="flex items-center text-neutral-600 text-sm mt-1">
                      <Building size={16} className="mr-1" />
                      <span>{job.company}</span>
                    </div>
                  </div>
                  <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-sm">
                    {job.salary}
                  </span>
                </div>

                <p className="text-neutral-600 mb-4">{job.description}</p>

                <div className="flex flex-wrap gap-4 mb-4 text-sm text-neutral-600">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    {job.type}
                  </div>
                  <div className="flex items-center">
                    <DollarSign size={16} className="mr-1" />
                    {job.salary}
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-4 mt-4">
                  <h4 className="font-medium mb-2">Requirements:</h4>
                  <p>{job.requirements}</p>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button variant="primary">Apply Now</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <NavBar onLogout={() => {}} />
    </motion.div>
  );
};

export default Jobs;
