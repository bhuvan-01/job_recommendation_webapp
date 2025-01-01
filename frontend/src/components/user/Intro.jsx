import useUser from "@/hooks/useUser";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState, useEffect } from "react";
import { Github, Linkedin, Pencil, Twitter } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";
import ContactImage from "../../assets/images/contactIcon.png";

const BASE_URL = import.meta.env.VITE_API || "http://localhost:5000";

const Intro = () => {
  const { user, updateUser } = useUser();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const [uploading, setUploading] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      bio: "",
      links: {
        linkedin: "",
        github: "",
        twitter: "",
      },
      picture: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full Name is required"),
      bio: Yup.string(),
      links: Yup.object({
        linkedin: Yup.string().url("Invalid URL"),
        github: Yup.string().url("Invalid URL"),
        twitter: Yup.string().url("Invalid URL"),
      }),
    }),
    onSubmit: (values) => {
      const [firstName, lastName] = values.fullName.split(" ");
      updateUser({
        ...values,
        firstName,
        lastName,
      });
      formik.resetForm();
      setIsEditFormOpen(false);
    },
    enableReinitialize: true,
  });

  // Update formik values when user data is available
  useEffect(() => {
    if (user) {
      formik.setValues({
        fullName: user.fullName || "",
        bio: user.bio || "",
        links: {
          linkedin: user.links?.linkedin || "",
          github: user.links?.github || "",
          twitter: user.links?.twitter || "",
        },
        picture: "",
      });
    }
  }, [user]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("photo", file);

        const response = await apiClient.post("/users/photo", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          toast.success("Photo uploaded");
          formik.setFieldValue("picture", response.data.user.photo);
          setUploading(false);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }
  if (!user) {
    return <p>No user data available</p>;
  }

  const {
    fullName,
    bio,
    links: { linkedin, github, twitter } = {},
    photo,
  } = user;
  const userPhotoUrl = photo ? `${BASE_URL}/${photo}` : ContactImage;

  return (
    <section className="border p-4  md:p-8 rounded-md">
      <div className="md:flex gap-4 items-center">
        <img
          src={userPhotoUrl}
          className="w-20 md:w-32 aspect-square object-cover rounded-full shadow-lg"
          alt="User"
          loading="lazy"
        />
        <div className="py-2 grow">
          <div className="flex w-full justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl capitalize font-semibold mb-2">
                {fullName}
              </h1>
              <p className="text-gray-600 my-2 text-xs sm:text-sm md:text-base">
                {bio ? bio : "No bio available"}
              </p>
            </div>

            <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setIsEditFormOpen(true)}
                  className="flex justify-center gap-2 items-center bg-blue-500"
                >
                  Edit <Pencil size={14} />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit}>
                  <div className="grid gap-4 py-4">
                    {/* full name */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fullName" className="text-right">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="col-span-3"
                      />
                      {formik.touched.fullName && formik.errors.fullName ? (
                        <div className="text-red-500 col-span-4">
                          {formik.errors.fullName}
                        </div>
                      ) : null}
                    </div>
                    {/* bio */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="bio" className="text-right">
                        Bio
                      </Label>
                      <Input
                        id="bio"
                        name="bio"
                        value={formik.values.bio}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="col-span-3"
                      />
                      {formik.touched.bio && formik.errors.bio ? (
                        <div className="text-red-500 col-span-4">
                          {formik.errors.bio}
                        </div>
                      ) : null}
                    </div>
                    {/* linkedin */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="linkedin" className="text-right">
                        LinkedIn
                      </Label>
                      <Input
                        id="linkedin"
                        name="links.linkedin"
                        value={formik.values.links.linkedin}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="col-span-3"
                      />
                      {formik.touched.links?.linkedin &&
                      formik.errors.links?.linkedin ? (
                        <div className="text-red-500 col-span-4">
                          {formik.errors.links.linkedin}
                        </div>
                      ) : null}
                    </div>
                    {/* github */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="github" className="text-right">
                        GitHub
                      </Label>
                      <Input
                        id="github"
                        name="links.github"
                        value={formik.values.links.github}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="col-span-3"
                      />
                      {formik.touched.links?.github &&
                      formik.errors.links?.github ? (
                        <div className="text-red-500 col-span-4">
                          {formik.errors.links.github}
                        </div>
                      ) : null}
                    </div>
                    {/* twitter */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="twitter" className="text-right">
                        Twitter
                      </Label>
                      <Input
                        id="twitter"
                        name="links.twitter"
                        value={formik.values.links.twitter}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="col-span-3"
                      />
                      {formik.touched.links?.twitter &&
                      formik.errors.links?.twitter ? (
                        <div className="text-red-500 col-span-4">
                          {formik.errors.links.twitter}
                        </div>
                      ) : null}
                    </div>
                    {/* picture */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="picture" className="text-right">
                        Profile Picture
                      </Label>
                      <Input
                        id="picture"
                        name="picture"
                        type="file"
                        className="col-span-3"
                        onChange={handleFileChange}
                      />
                      {uploading && <p>Uploading...</p>}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex gap-6 mt-4">
            {linkedin || github || twitter ? (
              <>
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin
                      size={24}
                      className="text-gray-600 hover:text-blue-600"
                    />
                  </a>
                )}
                {github && (
                  <a href={github} target="_blank" rel="noopener noreferrer">
                    <Github
                      size={24}
                      className="text-gray-600 hover:text-blue-600"
                    />
                  </a>
                )}
                {twitter && (
                  <a href={twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter
                      size={24}
                      className="text-gray-600 hover:text-blue-600"
                    />
                  </a>
                )}
              </>
            ) : (
              <p>No links found</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
