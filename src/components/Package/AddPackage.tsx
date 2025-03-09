"use client";
import React, { useState } from "react";
import {
  useForm,
  useFieldArray,
  FormProvider,
  Controller,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/CustomButton";
import {
  MdOutlineAddPhotoAlternate,
  MdOutlinePlaylistAdd,
} from "react-icons/md";
import { FiDelete } from "react-icons/fi";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  about: z.string().min(1, "About is required"),
  price: z.preprocess(
    (value) => Number(value),
    z.number().positive("Price must be greater than zero"),
  ),
  highlights: z
    .array(
      z.object({
        title: z.string().min(1, "Highlight title is required"),
        description: z.string().min(1, "Highlight description is required"),
      }),
    )
    .min(1, "At least one highlight is required"),
  inclusions: z
    .array(
      z.object({
        title: z.string().min(1, "Inclusions title is required"),
      }),
    )
    .min(1, "At least one Inclusions is required"),
  exclusions: z
    .array(
      z.object({
        title: z.string().min(1, "Exclusions title is required"),
      }),
    )
    .min(1, "At least one Exclusions is required"),
  cities: z
    .array(
      z.object({
        title: z.string().min(1, "Cities title is required"),
      }),
    )
    .min(1, "At least one Cities is required"),
  importantNotes: z
    .array(
      z.object({
        title: z.string().min(1, "ImportantNotes title is required"),
      }),
    )
    .min(1, "At least one ImportantNotes is required"),
  detailedItinerary: z.array(
    z.object({
      day: z.string().min(1, "Day is required"),
      title: z.string().min(1, "Itinerary title is required"),
      description: z.string().min(1, "Itinerary description is required"),
    }),
  ),
  category: z.string().min(1, "Category is required"), // New select field
  duration: z.string().min(1, "Duration is required"), // New select field
  country: z.string().min(1, "Country is required"), // New select field
  images: z
    .array(
      z.object({
        file: z.instanceof(File).nullable(),
      }),
    )
    .length(4, "Exactly 4 images are required")
    .refine(
      (images) => images.every((image) => image.file),
      "All images must have a file",
    ),
});

type FormSchema = z.infer<typeof formSchema>;

const DynamicForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      about: "",
      price: 0,
      highlights: [{ title: "", description: "" }],
      inclusions: [{ title: "" }],
      exclusions: [{ title: "" }],
      cities: [{ title: "" }],
      importantNotes: [{ title: "" }],
      detailedItinerary: [{ day: "", title: "", description: "" }],
      category: "", // Default value for the select field
      duration: "", // Default value for the select Duration
      country: "", // Default value for the select Duration
      images: [{ file: null }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images", // Field array name
  });

  const {
    fields: highlightFields,
    append: appendHighlight,
    remove: removeHighlight,
  } = useFieldArray({
    control,
    name: "highlights",
  });

  const {
    fields: inclusionFields,
    append: appendInclusion,
    remove: removeInclusion,
  } = useFieldArray({
    control,
    name: "inclusions",
  });

  const {
    fields: exclusionFields,
    append: appendExclusion,
    remove: removeExclusion,
  } = useFieldArray({
    control,
    name: "exclusions",
  });
  const {
    fields: citiesFields,
    append: appendcities,
    remove: removecities,
  } = useFieldArray({
    control,
    name: "cities",
  });

  const {
    fields: noteFields,
    append: appendNote,
    remove: removeNote,
  } = useFieldArray({
    control,
    name: "importantNotes",
  });

  const {
    fields: itineraryFields,
    append: appendItinerary,
    remove: removeItinerary,
  } = useFieldArray({
    control,
    name: "detailedItinerary",
  });

  const onSubmit = async (data: FormSchema) => {
    console.log("data.... :", data);
    setLoading(true);
    console.log("Form Data:", data);

    const formData = new FormData();

    // Append simple fields
    formData.append("title", data.title);
    formData.append("about", data.about);
    formData.append("price", data.price.toString());
    formData.append("category", data.category);
    formData.append("duration", data.duration);
    formData.append("country", data.country);

    // Append array fields
    data.highlights.forEach((highlight, index) => {
      formData.append(`highlights[${index}][title]`, highlight.title);
      formData.append(
        `highlights[${index}][description]`,
        highlight.description,
      );
    });

    data.inclusions.forEach((inclusion, index) => {
      formData.append(`inclusions[${index}][title]`, inclusion.title);
    });

    data.exclusions.forEach((exclusion, index) => {
      formData.append(`exclusions[${index}][title]`, exclusion.title);
    });

    data.cities.forEach((city, index) => {
      formData.append(`cities[${index}][title]`, city.title);
    });

    data.importantNotes.forEach((note, index) => {
      formData.append(`importantNotes[${index}][title]`, note.title);
    });

    data.detailedItinerary.forEach((itinerary, index) => {
      formData.append(`detailedItinerary[${index}][day]`, itinerary.day);
      formData.append(`detailedItinerary[${index}][title]`, itinerary.title);
      formData.append(
        `detailedItinerary[${index}][description]`,
        itinerary.description,
      );
    });

    // Append images
    data.images.forEach((image) => {
      if (image.file) {
        formData.append("images", image.file);
      }
    });

    // console formdata
    // for (const pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/package/create`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Upload Failed: " + response.statusText);
      }

      const responseData = await response.json();
      console.log("Upload Success:", responseData);
    } catch (error) {
      console.error("Upload Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="">
        <div className=" flex items-center justify-center bg-white p-6">
          {/* <span className=" w-full rounded-sm bg-slate-600 p-2 text-center text-2xl font-semibold uppercase text-slate-200">
            Package Submit FORM
          </span> */}
          <div className="w-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mb-10 w-full space-y-6 "
            >
              {/* Title */}
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  {...register("title")}
                  className="border-gray-300 w-full rounded border p-2"
                  placeholder="Enter title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm text-red">
                    {errors.title.message}
                  </p>
                )}
              </div>
              {/* Title End */}
              {/* About */}
              <div>
                <label className="block text-sm font-medium">About</label>
                <textarea
                  {...register("about")}
                  className="border-gray-300 w-full rounded border p-2"
                  placeholder="Enter about text"
                />
                {errors.about && (
                  <p className="text-red-500 text-sm text-red">
                    {errors.about.message}
                  </p>
                )}
              </div>
              {/* About End */}
              {/* Price */}
              <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                  {...register("price")}
                  className="border-gray-300 w-full rounded border p-2"
                  placeholder="Enter price"
                  type="number"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm text-red">
                    {errors.price?.message}
                  </p>
                )}
              </div>
              {/* Price End*/}
              {/* Highlights */}
              <div>
                <label className="block text-sm font-medium">Highlights</label>
                {highlightFields.map((field, index) => (
                  <div key={field.id} className="mb-2 flex items-center gap-2">
                    <input
                      {...register(`highlights.${index}.title`)}
                      className="border-gray-300 w-1/2 rounded border p-2"
                      placeholder="Highlight Title"
                    />
                    <input
                      {...register(`highlights.${index}.description`)}
                      className="border-gray-300 w-1/2 rounded border p-2"
                      placeholder="Highlight Description"
                    />
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="text-red-500"
                    >
                      {/* remove btn */}
                      <FiDelete className="text-slate-400" size={24} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    appendHighlight({ title: "", description: "" })
                  }
                  className="flex items-center justify-center gap-x-1 text-slate-500 "
                >
                  <MdOutlinePlaylistAdd size={22} />
                  Add
                </button>
              </div>
              {/* Highlights End */}
              {/* Inclusions */}
              <div>
                <label className="block text-sm font-medium">Inclusions</label>
                {inclusionFields.map((field, index) => (
                  <div key={field.id} className="mb-2 flex items-center gap-4">
                    <input
                      {...register(`inclusions.${index}.title`)}
                      className="border-gray-300 w-full rounded border p-2"
                      placeholder="Inclusion"
                    />
                    <button
                      type="button"
                      onClick={() => removeInclusion(index)}
                      className="text-red-500"
                    >
                      {/* remove btn */}
                      <FiDelete className="text-slate-400" size={24} />
                    </button>
                  </div>
                ))}
                <div className=" is flex justify-start">
                  <button
                    type="button"
                    onClick={() => appendInclusion({ title: "" })}
                    className="flex items-center justify-center gap-x-1 text-slate-500 "
                  >
                    <MdOutlinePlaylistAdd size={22} />
                    Add
                  </button>
                </div>
              </div>
              {/* Inclusions End */}
              {/* Exclusions */}
              <div>
                <label className="block text-sm font-medium">Exclusions</label>
                {exclusionFields.map((field, index) => (
                  <div key={field.id} className="mb-2 flex items-center gap-4">
                    <input
                      {...register(`exclusions.${index}.title`)}
                      className="border-gray-300 w-full rounded border p-2"
                      placeholder="Exclusion"
                    />
                    <button
                      type="button"
                      onClick={() => removeExclusion(index)}
                      className="text-red-500"
                    >
                      {/* remove btn */}
                      <FiDelete className="text-slate-400" size={24} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendExclusion({ title: "" })}
                  className="flex items-center justify-center gap-x-1 text-slate-500 "
                >
                  <MdOutlinePlaylistAdd size={22} />
                  Add
                </button>
              </div>
              {/* Exclusions End*/}

              {/* Cities */}
              <div>
                <label className="block text-sm font-medium">Cities</label>
                {citiesFields.map((field, index) => (
                  <div key={field.id} className="mb-2 flex items-center gap-4">
                    <input
                      {...register(`cities.${index}.title`)}
                      className="border-gray-300 w-full rounded border p-2"
                      placeholder="Exclusion"
                    />
                    <button
                      type="button"
                      onClick={() => removecities(index)}
                      className="text-red-500"
                    >
                      {/* remove btn */}
                      <FiDelete className="text-slate-400" size={24} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendcities({ title: "" })}
                  className="flex items-center justify-center gap-x-1 text-slate-500 "
                >
                  <MdOutlinePlaylistAdd size={22} />
                  Add
                </button>
              </div>
              {/* Cities End*/}

              {/* Important Notes */}
              <div>
                <label className="block text-sm font-medium">
                  Important Notes
                </label>
                {noteFields.map((field, index) => (
                  <div key={field.id} className="mb-2 flex items-center gap-4">
                    <input
                      {...register(`importantNotes.${index}.title`)}
                      className="border-gray-300 w-full rounded border p-2"
                      placeholder="Note"
                    />
                    <button
                      type="button"
                      onClick={() => removeNote(index)}
                      className="text-red-500"
                    >
                      {/* remove btn */}
                      <FiDelete className="text-slate-400" size={24} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendNote({ title: "" })}
                  className="flex items-center justify-center gap-x-1 text-slate-500 "
                >
                  <MdOutlinePlaylistAdd size={22} />
                  Add
                </button>
              </div>
              {/* Important Notes End */}

              {/* Detailed Itinerary */}
              <div>
                <label className="block text-sm font-medium">
                  Detailed Itinerary
                </label>
                {itineraryFields.map((field, index) => (
                  <div key={field.id} className="mb-4 space-y-2">
                    <div className=" flex w-full items-start justify-center">
                      <div className=" flex w-full flex-col items-start justify-start gap-y-2">
                        <input
                          {...register(`detailedItinerary.${index}.day`)}
                          className="border-gray-300 w-full rounded border p-2"
                          placeholder="Day"
                        />
                        <input
                          {...register(`detailedItinerary.${index}.title`)}
                          className="border-gray-300 w-full rounded border p-2"
                          placeholder="Itinerary Title"
                        />
                        <textarea
                          {...register(
                            `detailedItinerary.${index}.description`,
                          )}
                          className="border-gray-300 w-full rounded border p-2"
                          placeholder="Itinerary Description"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItinerary(index)}
                        className="text-red-500 ml-3"
                      >
                        {/* remove btn */}
                        <FiDelete className="text-slate-400" size={24} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    appendItinerary({ day: "", title: "", description: "" })
                  }
                  className="flex items-center justify-center gap-x-1 text-slate-500 "
                >
                  <MdOutlinePlaylistAdd size={22} />
                  Add
                </button>
              </div>
              {/* Detailed Itinerary End */}
              {/* Select Option (Category) */}
              <div>
                <label className="block text-sm font-medium">Category</label>
                <select
                  {...register("category")}
                  className="border-gray-300 w-full rounded border p-2"
                >
                  <option value="">Select a category</option>
                  <option value="Quick Gateways">Quick Gateways</option>
                  <option value="Adventure & Discovery">
                    Adventure & Discovery
                  </option>
                  <option value="Relaxation & Retreat">
                    Relaxation & Retreat
                  </option>
                  <option value="Cultural Immersion">Cultural Immersion</option>
                  <option value="Luxury & Exclusivity">
                    Luxury & Exclusivity
                  </option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm text-red">
                    {errors.category.message}
                  </p>
                )}
              </div>
              {/* Select Option (Category) End*/}
              {/* Select Duration*/}
              <div>
                <label className="block text-sm font-medium">Duration</label>
                <select
                  {...register("duration")}
                  className="border-gray-300 w-full rounded border p-2"
                >
                  <option value="">Select a duration</option>
                  <option value="3 day 2 night">3 day 2 night</option>
                  <option value="4 day 3 night">4 day 3 night</option>
                  <option value="5 day 4 night">5 day 4 night</option>
                  <option value="5 day 4 night">5 day 4 night</option>
                  <option value="7 day 6 night">7 day 6 night</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm text-red">
                    {errors.duration?.message}
                  </p>
                )}
              </div>
              {/* Select Duration End*/}
              {/* Select Country*/}
              <div>
                <label className="block text-sm font-medium">Country</label>
                <select
                  {...register("country")}
                  className="border-gray-300 w-full rounded border p-2"
                >
                  <option value="">Select a Country</option>
                  <option value="India">India</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Turkey">Turkey</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Egypt">Egypt</option>
                  <option value="Maldives">Maldives</option>
                  <option value="Dubai">Dubai</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Malaysia">Malaysia</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm text-red">
                    {errors.country?.message}
                  </p>
                )}
              </div>
              {/* Select Country End*/}

              {/* images */}

              <div>
                <label className="block font-medium">Images</label>
                {fields.map((field, index) => (
                  <div key={field.id} className="mb-2 flex items-center gap-4">
                    <Controller
                      control={control}
                      name={`images.${index}.file`}
                      render={({ field }) => (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            field.onChange(file);
                          }}
                          className="file-input"
                        />
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="bg-red-500 rounded px-2 py-1 text-white"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {errors.images && (
                  <p className="text-red-500 text-red">
                    {errors.images.message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => append({ file: null })}
                  className=" flex items-center justify-center gap-x-1 rounded-md p-1 text-slate-600"
                >
                  <MdOutlineAddPhotoAlternate />
                  Add Image
                </button>
              </div>
              {/* <div className="">
        Add Image
          
        </div> */}

              {/* images */}
              {/* <button
          disabled={loading}
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Loading ...." : "Submit Here"}
        </button> */}
              <div className="flex items-center justify-center">
                <Button
                  isDisabled={loading}
                  btnType="submit"
                  title={loading ? "Loading ...." : "Submit Here"}
                  containerStyles={`${loading ? "bg-slate-400" : "bg-orange-deep"} p-2 text-white uppercase rounded-md`}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
