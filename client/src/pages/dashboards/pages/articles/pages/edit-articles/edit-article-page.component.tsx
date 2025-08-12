import { useParams, useOutletContext } from "react-router";
import { useApi } from "@/hooks/use-api";

import InputField from "@/components/forms/input-field.component";
import SelectField from "@/components/forms/select-field.component";
import TextAreaField from "@/components/forms/textarea-field.component";
import type { News } from "@/types/news.type";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";
import { ARTICLE_CATEGORIES } from "../models/constants/article-categories.constant";
import type { ArticleErrors } from "../types/article-model.type";

interface EditableNews extends News {
  image?: File | null;
}

const EditArticlePage = () => {
  const params = useParams<{ id: string }>();
  const newsData = useOutletContext<News[]>();

  const currentNews = newsData?.find((newsDatum) => newsDatum.id === params.id);

  const [errorMessage, setErrorMessage] = useState<ArticleErrors>({
    title: "",
    category: "",
    content: "",
    imageUrl: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editArticlePayload, setEditArticlePayload] = useState<EditableNews>(
    currentNews!,
  );
  const api = useApi(`/news/${params.id}`, { method: "put" });

  useEffect(() => {
    if (api.isSuccess) {
      alert("Artikkelen ble oppdatert");
    }
  }, [api.isSuccess]);

  useEffect(() => {
    if (api.isError) {
      console.log(api.error);
      alert(api.error?.message);
    }
  }, [api.isError, api.error]);

  // Set initial image preview from existing article
  useEffect(() => {
    if (editArticlePayload?.imageUrl) {
      setImagePreview(editArticlePayload.imageUrl);
    }
  }, [editArticlePayload?.imageUrl]);

  function handleChangePayload(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const state = event.target.dataset.state as
      | "title"
      | "category"
      | "content"
      | "image";

    if (state === "image") {
      const files = (event.target as HTMLInputElement).files;
      const file = files && files[0] ? files[0] : null;

      // Create preview URL for the selected image
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }

      // Update state with the file
      setEditArticlePayload((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          image: file, // Store the File object
        };
      });
    } else {
      // Handle other field changes
      setEditArticlePayload((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [state]: event.target.value,
        };
      });
    } // Clear error message for the field being changed
    setErrorMessage((prev) => ({
      ...prev,
      [state]: "",
    }));
  }

  async function handleRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editArticlePayload) return;

    const validationErrors: ArticleErrors = {
      title: !editArticlePayload.title ? "Tittel er påkrevd" : "",
      content: !editArticlePayload.content ? "Innhold er påkrevd" : "",
      category: !editArticlePayload.category ? "Kategori er påkrevd" : "",
      imageUrl: !editArticlePayload.imageUrl ? "Bilde er påkrevd" : "",
      image: "",
    };

    setErrorMessage(validationErrors);

    const isFormValid = !Object.values(validationErrors).some((error) => error);

    if (isFormValid) {
      const formData = new FormData();
      formData.append("title", editArticlePayload.title);
      formData.append("category", editArticlePayload.category);
      formData.append("content", editArticlePayload.content);

      // If there's a new image file, append it
      if (editArticlePayload.image) {
        formData.append("image", editArticlePayload.image);
      }
      // Always send the current imageUrl
      formData.append("imageUrl", editArticlePayload.imageUrl);

      await api.mutate(formData);
    }
  }

  return (
    <>
      <h1 style={{ marginBottom: "1em" }}>Endre artikkel</h1>
      <form onSubmit={handleRequestSubmit}>
        <StackLayout>
          <InputField
            label="Tittel"
            type="text"
            placeholder="Skriv tittel"
            value={editArticlePayload?.title}
            onChange={handleChangePayload}
            data-state="title"
            errorMessage={errorMessage.title || ""}
          />

          <SelectField
            label="Kategori"
            value={editArticlePayload?.category}
            onChange={handleChangePayload}
            data-state="category"
            options={ARTICLE_CATEGORIES}
            errorMessage={errorMessage.category || ""}
          />

          {imagePreview && (
            <div style={{ maxWidth: "300px", margin: "1em 0" }}>
              <img
                src={imagePreview}
                alt="Article Preview"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "4px",
                }}
              />
            </div>
          )}

          <InputField
            type="file"
            label="Last opp Bilde"
            onChange={handleChangePayload}
            accept="image/*"
            data-state="image"
            errorMessage={errorMessage.image}
          />

          <TextAreaField
            label="Innhold"
            value={editArticlePayload?.content}
            placeholder="Skriv inn innhold"
            onChange={handleChangePayload}
            data-state="content"
            errorMessage={errorMessage.content}
          />

          <button type="submit" style={{ width: "fit-content" }} title="endre">
            Endre
          </button>
        </StackLayout>
      </form>
    </>
  );
};

export default EditArticlePage;
