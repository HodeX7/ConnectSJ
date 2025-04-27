// File: src/components/Signup.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Lock,
  User,
  Calendar,
  Heart,
  Globe,
  Users,
  Briefcase,
  ChevronFirst as FirstAid,
  Medal,
  GraduationCap,
  Phone,
  Home,
  DollarSign,
  Bus,
} from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import { auth } from "../firebase";

interface SignupProps {
  onSignup: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    calstateId: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "preferNotToSay",
    maritalStatus: "single",
    hasPets: "no",
    petType: "",
    languagePreference: "en",
    familySize: "1",
    desiredJobTitle: "",
    healthIssues: "",
    isVeteran: "no",
    race: "",
    ethnicity: "",
    educationLevel: "",
    skills: "",
    emergencyContact: "",
    housingStatus: "temporary",
    income: "",
    benefits: "",
    transportation: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name])
      setErrors((prev) => {
        const ne = { ...prev };
        delete ne[name];
        return ne;
      });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.calstateId)
      newErrors.calstateId = t("auth.calstateId") + " is required";
    if (!formData.password)
      newErrors.password = t("auth.password") + " is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (
      formData.age &&
      (isNaN(Number(formData.age)) ||
        Number(formData.age) < 18 ||
        Number(formData.age) > 100)
    )
      newErrors.age = "Please enter a valid age between 18 and 100";
    if (formData.hasPets === "yes" && !formData.petType)
      newErrors.petType = "Please specify the type of pet";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const email = formData.calstateId.includes("@")
        ? formData.calstateId
        : `${formData.calstateId}@yourdomain.edu`;
      await createUserWithEmailAndPassword(auth, email, formData.password);
      onSignup();
      localStorage.setItem("user", formData.calstateId);
      navigate("/dashboard");
    } catch (err: any) {
      setErrors({
        firebase:
          err.code === "auth/email-already-in-use"
            ? "This CalState ID is already registered."
            : err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-primary-100 p-4 py-8">
      <motion.div
        className="w-full max-w-2xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="text-center mb-6" variants={itemVariants}>
          <h1 className="text-3xl font-bold text-primary-700 mb-2">
            {t("app.name")}
          </h1>
          <p className="text-neutral-600">{t("auth.createAccount")}</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="mb-4">
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-semibold text-neutral-800 mb-6 text-center">
                {t("auth.signup")}
              </h2>
              {errors.firebase && (
                <div className="mb-4 p-3 bg-error-50 text-error-600 rounded-lg text-sm">
                  {errors.firebase}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t("auth.calstateId")}
                  id="calstateId"
                  name="calstateId"
                  type="text"
                  value={formData.calstateId}
                  onChange={handleChange}
                  icon={<User size={18} />}
                  placeholder="CS12345678"
                  error={errors.calstateId}
                  autoComplete="username"
                />
                <Input
                  label={t("auth.password")}
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  icon={<Lock size={18} />}
                  error={errors.password}
                  autoComplete="new-password"
                />
                <Input
                  label={t("auth.confirmPassword")}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  icon={<Lock size={18} />}
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                />
                <Input
                  label="Age"
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  icon={<Calendar size={18} />}
                  error={errors.age}
                />
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="nonBinary">Non-binary</option>
                    <option value="preferNotToSay">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-700">
                    Marital Status
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-700">
                    Language Preference
                  </label>
                  <select
                    name="languagePreference"
                    value={formData.languagePreference}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="vi">Vietnamese</option>
                  </select>
                </div>
                <Input
                  label="Family Size"
                  id="familySize"
                  name="familySize"
                  type="number"
                  value={formData.familySize}
                  onChange={handleChange}
                  icon={<Users size={18} />}
                />
                <Input
                  label="Desired Job Title"
                  id="desiredJobTitle"
                  name="desiredJobTitle"
                  type="text"
                  value={formData.desiredJobTitle}
                  onChange={handleChange}
                  icon={<Briefcase size={18} />}
                />
                <Input
                  label="Health Issues"
                  id="healthIssues"
                  name="healthIssues"
                  type="text"
                  value={formData.healthIssues}
                  onChange={handleChange}
                  icon={<FirstAid size={18} />}
                />
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-700">
                    Veteran Status
                  </label>
                  <select
                    name="isVeteran"
                    value={formData.isVeteran}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <Input
                  label="Race"
                  id="race"
                  name="race"
                  type="text"
                  value={formData.race}
                  onChange={handleChange}
                  icon={<Globe size={18} />}
                />
                <Input
                  label="Ethnicity"
                  id="ethnicity"
                  name="ethnicity"
                  type="text"
                  value={formData.ethnicity}
                  onChange={handleChange}
                  icon={<Globe size={18} />}
                />
                <Input
                  label="Education Level"
                  id="educationLevel"
                  name="educationLevel"
                  type="text"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  icon={<GraduationCap size={18} />}
                />
                <Input
                  label="Skills"
                  id="skills"
                  name="skills"
                  type="text"
                  value={formData.skills}
                  onChange={handleChange}
                  icon={<Medal size={18} />}
                />
                <Input
                  label="Emergency Contact"
                  id="emergencyContact"
                  name="emergencyContact"
                  type="text"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  icon={<Phone size={18} />}
                />
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-700">
                    Housing Status
                  </label>
                  <select
                    name="housingStatus"
                    value={formData.housingStatus}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  >
                    <option value="temporary">Temporary Housing</option>
                    <option value="shelter">Shelter</option>
                    <option value="street">Street</option>
                    <option value="transitional">Transitional Housing</option>
                  </select>
                </div>
                <Input
                  label="Current Income"
                  id="income"
                  name="income"
                  type="text"
                  value={formData.income}
                  onChange={handleChange}
                  icon={<DollarSign size={18} />}
                />
                <Input
                  label="Benefits Received"
                  id="benefits"
                  name="benefits"
                  type="text"
                  value={formData.benefits}
                  onChange={handleChange}
                  icon={<DollarSign size={18} />}
                />
                <Input
                  label="Transportation"
                  id="transportation"
                  name="transportation"
                  type="text"
                  value={formData.transportation}
                  onChange={handleChange}
                  icon={<Bus size={18} />}
                />
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-700">
                    Have Pets?
                  </label>
                  <select
                    name="hasPets"
                    value={formData.hasPets}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                {formData.hasPets === "yes" && (
                  <Input
                    label="Pet Type"
                    id="petType"
                    name="petType"
                    type="text"
                    value={formData.petType}
                    onChange={handleChange}
                    icon={<Heart size={18} />}
                    error={errors.petType}
                  />
                )}
              </div>
              <div className="mt-6">
                <Button type="submit" fullWidth disabled={isLoading}>
                  {isLoading ? t("common.loading") : t("auth.createAccount")}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>

        <motion.div className="text-center mt-4" variants={itemVariants}>
          <p className="text-neutral-600">
            {t("auth.hasAccount")}{" "}
            <Link
              to="/login"
              className="text-primary-600 font-medium hover:text-primary-700"
            >
              {t("auth.loginHere")}
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
