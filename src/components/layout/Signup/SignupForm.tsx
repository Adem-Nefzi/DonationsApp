"use client";

import type React from "react";

import type { UseFormReturn } from "react-hook-form";
import type { FormValues } from "../../Signup";
import {
  UserPlus,
  Check,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Upload,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useRef } from "react";

interface SignUpFormProps {
  form: UseFormReturn<FormValues>;
  userType: "donor" | "recipient";
  setUserType: (type: "donor" | "recipient") => void;
  donorType: "individual" | "organization";
  setDonorType: (type: "individual" | "organization") => void;
  loading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  formStatus: {
    type: "success" | "error" | null;
    message: string;
  };
  onSubmit: (values: FormValues) => void;
  passwordStrength: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
  passwordStrengthScore: number;
  setShowMap: (show: boolean) => void;
}

export default function SignUpForm({
  form,
  userType,
  setUserType,
  donorType,
  setDonorType,
  loading,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  formStatus,
  onSubmit,
  passwordStrength,
  passwordStrengthScore,
}: SignUpFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        // You would typically handle the file upload here or store it in form state
        form.setValue("organizationLogo", file);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full shadow-lg overflow-hidden bg-card/95 backdrop-blur-sm border-border/50">
      {/* Card header */}
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-center gap-2 justify-center mb-2">
          <UserPlus className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-center">Create Account</h2>
        </div>
        <p className="text-center text-muted-foreground">
          Fill in your details to get started
        </p>
      </CardHeader>

      {/* User type selector */}
      <div className="p-6 pb-0">
        <div className="flex rounded-md overflow-hidden border border-border">
          <Button
            type="button"
            onClick={() => setUserType("donor")}
            variant={userType === "donor" ? "default" : "ghost"}
            className="flex-1 rounded-none"
          >
            Donor
          </Button>
          <Button
            type="button"
            onClick={() => setUserType("recipient")}
            variant={userType === "recipient" ? "default" : "ghost"}
            className="flex-1 rounded-none"
          >
            Recipient
          </Button>
        </div>
      </div>

      {/* Form */}
      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Status message */}
          {formStatus.type && (
            <Alert
              variant={
                formStatus.type === "success" ? "default" : "destructive"
              }
              className={`${
                formStatus.type === "success"
                  ? "bg-green-500/10 text-green-500 border border-green-500/20"
                  : ""
              }`}
            >
              {formStatus.type === "success" ? (
                <Check className="h-4 w-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
              )}
              <AlertDescription>{formStatus.message}</AlertDescription>
            </Alert>
          )}

          {/* Donor Type (only for donors) */}
          {userType === "donor" && (
            <div className="space-y-3">
              <Label className="text-base">Donor Type</Label>
              <RadioGroup
                defaultValue={donorType}
                onValueChange={(value) =>
                  setDonorType(value as "individual" | "organization")
                }
                className="flex gap-4 p-3 rounded-md border"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual" className="font-normal">
                    Solo Donor
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="organization" id="organization" />
                  <Label htmlFor="organization" className="font-normal">
                    Association
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Individual Donor or Recipient Fields */}
          {((userType === "donor" && donorType === "individual") ||
            userType === "recipient") && (
            <>
              {/* First Name field */}
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...form.register("firstName")}
                  className={
                    "firstName" in form.formState.errors ||
                    (formStatus.type === "error" &&
                      /first[_\s]?name/i.test(formStatus.message))
                      ? "border-destructive"
                      : ""
                  }
                />
                {"firstName" in form.formState.errors ? (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.firstName?.message}
                  </p>
                ) : formStatus.type === "error" &&
                  /first[_\s]?name/i.test(formStatus.message) ? (
                  <p className="text-sm font-medium text-destructive">
                    {formStatus.message}
                  </p>
                ) : null}
              </div>

              {/* Last Name field */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...form.register("lastName")}
                  className={
                    "lastName" in form.formState.errors ||
                    (formStatus.type === "error" &&
                      /last[_\s]?name/i.test(formStatus.message))
                      ? "border-destructive"
                      : ""
                  }
                />
                {"lastName" in form.formState.errors ? (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.lastName?.message}
                  </p>
                ) : formStatus.type === "error" &&
                  /last[_\s]?name/i.test(formStatus.message) ? (
                  <p className="text-sm font-medium text-destructive">
                    {formStatus.message}
                  </p>
                ) : null}
              </div>
            </>
          )}

          {/* Organization Name and Logo (only for organization donors) */}
          {userType === "donor" && donorType === "organization" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  {...form.register("organizationName")}
                  className={
                    "organizationName" in form.formState.errors ||
                    (formStatus.type === "error" &&
                      /organization|name/i.test(formStatus.message))
                      ? "border-destructive"
                      : ""
                  }
                />
                {"organizationName" in form.formState.errors ? (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.organizationName?.message}
                  </p>
                ) : formStatus.type === "error" &&
                  /organization|name/i.test(formStatus.message) ? (
                  <p className="text-sm font-medium text-destructive">
                    {formStatus.message}
                  </p>
                ) : null}
              </div>

              {/* Organization Logo Upload */}
              <div className="space-y-2">
                <Label htmlFor="organizationLogo">Organization Logo</Label>
                <div
                  className="flex flex-col items-center gap-4 p-4 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <input
                    type="file"
                    id="organizationLogo"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />

                  {previewImage ? (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                      <img
                        src={previewImage || "/placeholder.svg"}
                        alt="Organization Logo Preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-2 right-2 h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage(null);
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                      >
                        <AlertCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="bg-primary/10 rounded-full p-3">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Click to upload logo</p>
                        <p className="text-sm text-muted-foreground">
                          SVG, PNG, JPG or GIF (max. 2MB)
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Category field - only for organization donors */}
          {userType === "donor" && donorType === "organization" && (
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) =>
                  form.setValue(
                    "category",
                    value as
                      | "Food"
                      | "Clothes"
                      | "Healthcare"
                      | "Education"
                      | "Home supplies"
                  )
                }
                value={form.watch("category") as string}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Clothes">Clothes</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Home supplies">Home supplies</SelectItem>
                </SelectContent>
              </Select>
              {"category" in form.formState.errors && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.category?.message}
                </p>
              )}
            </div>
          )}

          {/* Email field - for all user types */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              className={
                form.formState.errors.email ||
                (formStatus.type === "error" &&
                  /email/i.test(formStatus.message))
                  ? "border-destructive"
                  : ""
              }
            />
            {form.formState.errors.email ? (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.email.message}
              </p>
            ) : formStatus.type === "error" &&
              /email/i.test(formStatus.message) ? (
              <p className="text-sm font-medium text-destructive">
                {formStatus.message}
              </p>
            ) : null}
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...form.register("password")}
                className={
                  form.formState.errors.password ||
                  (formStatus.type === "error" &&
                    /password/i.test(formStatus.message))
                    ? "border-destructive pr-10"
                    : "pr-10"
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>

            {/* Error Messages */}
            {form.formState.errors.password ? (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.password.message}
              </p>
            ) : formStatus.type === "error" &&
              /password/i.test(formStatus.message) ? (
              <p className="text-sm font-medium text-destructive">
                {formStatus.message}
              </p>
            ) : null}

            {/* Password Strength Indicator */}
            <div className="mt-2 space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((segment) => (
                  <div
                    key={segment}
                    className={`h-1.5 flex-1 rounded-full ${
                      passwordStrengthScore >= segment
                        ? passwordStrengthScore === 1
                          ? "bg-destructive"
                          : passwordStrengthScore === 2
                          ? "bg-orange-500"
                          : passwordStrengthScore === 3
                          ? "bg-yellow-500"
                          : passwordStrengthScore === 4
                          ? "bg-green-400"
                          : "bg-green-500"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <ul className="text-xs space-y-1 mt-1">
                <li className="flex items-center gap-1">
                  <span
                    className={
                      passwordStrength.length
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    {passwordStrength.length ? (
                      <CheckCircle2 className="h-3 w-3 inline" />
                    ) : (
                      "○"
                    )}
                  </span>
                  <span>At least 8 characters</span>
                </li>
                <li className="flex items-center gap-1">
                  <span
                    className={
                      passwordStrength.uppercase
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    {passwordStrength.uppercase ? (
                      <CheckCircle2 className="h-3 w-3 inline" />
                    ) : (
                      "○"
                    )}
                  </span>
                  <span>At least one uppercase letter</span>
                </li>
                <li className="flex items-center gap-1">
                  <span
                    className={
                      passwordStrength.lowercase
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    {passwordStrength.lowercase ? (
                      <CheckCircle2 className="h-3 w-3 inline" />
                    ) : (
                      "○"
                    )}
                  </span>
                  <span>At least one lowercase letter</span>
                </li>
                <li className="flex items-center gap-1">
                  <span
                    className={
                      passwordStrength.number
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    {passwordStrength.number ? (
                      <CheckCircle2 className="h-3 w-3 inline" />
                    ) : (
                      "○"
                    )}
                  </span>
                  <span>At least one number</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Confirm Password field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...form.register("confirmPassword")}
                className={
                  form.formState.errors.confirmPassword ||
                  (formStatus.type === "error" &&
                    /confirm|password/i.test(formStatus.message))
                    ? "border-destructive pr-10"
                    : "pr-10"
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
            {form.formState.errors.confirmPassword ? (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.confirmPassword.message}
              </p>
            ) : formStatus.type === "error" &&
              /confirm|password/i.test(formStatus.message) ? (
              <p className="text-sm font-medium text-destructive">
                {formStatus.message}
              </p>
            ) : null}
          </div>

          {/* Phone field - required for organization, optional for others */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              {...form.register("phone")}
              className={
                form.formState.errors.phone ||
                (formStatus.type === "error" &&
                  /phone/i.test(formStatus.message))
                  ? "border-destructive"
                  : ""
              }
            />
            {form.formState.errors.phone ? (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.phone.message}
              </p>
            ) : formStatus.type === "error" &&
              /phone/i.test(formStatus.message) ? (
              <p className="text-sm font-medium text-destructive">
                {formStatus.message}
              </p>
            ) : null}
          </div>

          {/* Address field - required for organization, optional for others */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="flex gap-2">
              <Input
                id="address"
                {...form.register("address")}
                className={
                  form.formState.errors.address ||
                  (formStatus.type === "error" &&
                    /address/i.test(formStatus.message))
                    ? "border-destructive"
                    : ""
                }
              />
            </div>
            {form.formState.errors.address ? (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.address.message}
              </p>
            ) : formStatus.type === "error" &&
              /address/i.test(formStatus.message) ? (
              <p className="text-sm font-medium text-destructive">
                {formStatus.message}
              </p>
            ) : null}
          </div>

          {/* Description field - only for organization donors */}
          {userType === "donor" && donorType === "organization" && (
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                className={
                  "description" in form.formState.errors ||
                  (formStatus.type === "error" &&
                    /description/i.test(formStatus.message))
                    ? "border-destructive min-h-[80px]"
                    : "min-h-[80px]"
                }
              />
              {"description" in form.formState.errors ? (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.description?.message}
                </p>
              ) : formStatus.type === "error" &&
                /description/i.test(formStatus.message) ? (
                <p className="text-sm font-medium text-destructive">
                  {formStatus.message}
                </p>
              ) : null}
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-3 rounded-md p-4 border bg-background/50">
            <Checkbox
              id="termsAccepted"
              checked={form.watch("termsAccepted")}
              onCheckedChange={(checked) => {
                form.setValue("termsAccepted", checked as true);
              }}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="termsAccepted" className="text-sm font-medium">
                I agree to the terms
              </Label>
              {form.formState.errors.termsAccepted && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.termsAccepted.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        {/* Sign in link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-primary font-medium hover:underline inline-flex items-center"
            >
              Sign in <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
