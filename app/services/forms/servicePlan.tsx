"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch } from "@/lib/redux/hooks";

interface ServicePlanFormProps {
  subServiceId: string;
  initialValues?: {
    _id?: string;
    name: string;
    ourPrice: number;
    validity: string;
    category: string;
    autopilotId?: string;
    network?: string;
    active: boolean;
  };
  onSubmitSuccess?: () => void;
}

const servicePlanValidation = Yup.object().shape({
  name: Yup.string().required("Plan name is required"),
  ourPrice: Yup.number().required("Price is required"),
  validity: Yup.string().required("Validity is required"),
  category: Yup.string().required("Category is required"),
  active: Yup.boolean(),
});

export function ServicePlanForm({
  subServiceId,
  initialValues = {
    name: "",
    ourPrice: 0,
    validity: "",
    category: "",
    autopilotId: "",
    network: "",
    active: true,
  },
  onSubmitSuccess,
}: ServicePlanFormProps) {
  const dispatch = useAppDispatch();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={servicePlanValidation}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        try {
          if (!values._id) {
            // dispatch addServicePlan here
            console.log("Creating plan:", values);
          } else {
            console.log("Updating plan:", values);
          }
          setSubmitting(false);
          onSubmitSuccess?.();
        } catch {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="space-y-4">
          <div>
            <label className="block font-medium">Plan Name</label>
            <Field as={Input} name="name" />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-medium">Price</label>
            <Field as={Input} type="number" name="ourPrice" />
            <ErrorMessage
              name="ourPrice"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-medium">Validity</label>
            <Field as={Input} name="validity" />
          </div>

          <div>
            <label className="block font-medium">Category</label>
            <Field as={Input} name="category" />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={values.active}
              onCheckedChange={(v) => setFieldValue("active", v)}
            />
            <span>Active</span>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {values._id ? "Update Plan" : "Create Plan"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
