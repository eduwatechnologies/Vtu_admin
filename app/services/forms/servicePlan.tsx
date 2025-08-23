"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  addServicePlan,
  updateServicePlan,
} from "@/lib/redux/slices/service/serviceThunk";
import { ServicePlan } from "@/lib/redux/slices/service/type";

interface ServicePlanFormProps {
  subServiceId: string;
  initialValues?: Partial<ServicePlan>;
  onSubmitSuccess?: () => void;
}

const servicePlanSchema = Yup.object().shape({
  name: Yup.string().required("Plan name is required"),
  ourPrice: Yup.number().required("Price is required"),
  serviceType: Yup.string().required("ServiceType is required"),
  network: Yup.string().required("network is required"),
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
    serviceType: "",
    network: "",
    autopilotId: "",
    easyaccessId: "",

    active: true,
  },
  onSubmitSuccess,
}: ServicePlanFormProps) {
  const dispatch = useAppDispatch();
  console.log(subServiceId, "the id");

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={servicePlanSchema}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        try {
          if (!values._id) {
            // CREATE
            await dispatch(
              addServicePlan({
                subServiceId: subServiceId,
                payload: {
                  name: values.name!,
                  ourPrice: values.ourPrice!,
                  validity: values.validity!,
                  category: values.category!,
                  serviceType: values.serviceType || "",
                  network: values.network || "",
                  autopilotId: values.autopilotId || "",
                  easyaccessId: values.easyaccessId || "",
                  active: values.active ?? true,
                },
              })
            );
          } else {
            // UPDATE
            await dispatch(
              updateServicePlan({
                id: values._id,
                data: {
                  name: values.name,
                  ourPrice: values.ourPrice,
                  validity: values.validity,
                  category: values.category,
                  network: values.network,
                  autopilotId: values.autopilotId,
                  easyaccessId: values.easyaccessId,
                  active: values.active,
                },
              })
            );
          }

          setSubmitting(false);
          onSubmitSuccess?.();
        } catch (err) {
          console.error("Failed to submit plan:", err);
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
            <ErrorMessage
              name="validity"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-medium">Category</label>
            <Field as={Input} name="category" />
            <ErrorMessage
              name="category"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div className="flex justify-between space-x-3 items-center">
            <div>
              <label className="block font-medium">Service Type</label>
              <Field
                as="select"
                name="serviceType"
                className="w-full border p-2 rounded"
              >
                {/* <option value="">Select Service Type</option> */}
                <option value="data">Data</option>
                <option value="airtime">Airtime</option>
                <option value="cable">Cable TV</option>
                <option value="electricity">Electricity</option>
                <option value="exam_pin">Exam Pin</option>
              </Field>
              <ErrorMessage
                name="serviceType"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Network (Dropdown) */}
            <div>
              <label className="block font-medium">Network</label>
              <Field
                as="select"
                name="network"
                className="w-full border p-2 rounded"
              >
                <option value="">Select Network</option>
                <option value="01">MTN</option>
                <option value="02">Airtel</option>
                <option value="03">GLO</option>
                <option value="04">9Mobile</option>
                <option value="05">DSTV</option>
                <option value="06">GOTV</option>
                <option value="07">STARTIMES</option>
                <option value="08">SHOWMAX</option>
              </Field>
              <ErrorMessage
                name="network"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <label className="block font-medium">EasyaccessId</label>
              <Field as={Input} name="easyaccessId" />
              <ErrorMessage
                name="easyaccessId"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-medium">AutopilotId</label>
              <Field as={Input} name="autopilotId" />
              <ErrorMessage
                name="autopilotId"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={values.active}
              onCheckedChange={(checked) => setFieldValue("active", checked)}
            />
            <span>Active</span>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {values._id ? "Update Plan" : "Create Plan"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
