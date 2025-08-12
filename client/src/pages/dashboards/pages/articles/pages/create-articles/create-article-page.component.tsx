import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";

import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";
import { useApi } from "@/hooks/use-api";

import InputField from "@/components/forms/input-field.component";
import SelectField from "@/components/forms/select-field.component";
import TextAreaField from "@/components/forms/textarea-field.component";
import { ARTICLE_CATEGORIES } from "../models/constants/article-categories.constant";
import type {
  ArticleErrors,
  ArticlePayload,
} from "../types/article-model.type";
import ClusterLayout from "@/components/compositions/cluster-layouts/cluster-layout.component";

const INITIAL_ARTICLE: ArticlePayload = {
  title: "",
  image: "",
  category: "",
  imageUrl: "",
  content: "",
};

const CreateArticle = () => {
  const [errorMessage, setErrorMessage] = useState<ArticleErrors>({
    title: "",
    image: "",
    category: "",
    imageUrl: "",
    content: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [articlePayload, setArticlePayload] =
    useState<ArticlePayload>(INITIAL_ARTICLE);

  const api = useApi("/news", {
    method: "post",
  });

  useEffect(() => {
    if (api.isSuccess) {
      alert("Artikkelen ble opprettet");
      setArticlePayload(INITIAL_ARTICLE);
    }
  }, [api.isSuccess]);

  useEffect(() => {
    if (api.isError) {
      console.log(api.error);
      alert(api.error?.message);
    }
  }, [api.isError]);

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
    let currentValue: string | File | null = event.target.value;

    if (state === "image") {
      const files = (event.target as HTMLInputElement).files;
      currentValue = files && files[0] ? files[0] : null;

      // Create preview URL for the selected image
      if (currentValue instanceof File) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target?.result as string);
        };
        reader.readAsDataURL(currentValue);
      } else {
        setImagePreview(null);
      }
    }

    setArticlePayload((prev) => {
      return {
        ...prev,
        [state]: currentValue,
      };
    });

    // Clear error message for the field being changed
    setErrorMessage((prev) => ({
      ...prev,
      [state]: "",
    }));
  }

  async function handleRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors: ArticleErrors = {
      title: !articlePayload.title ? "Tittel er påkrevd" : "",
      content: !articlePayload.content ? "Innhold er påkrevd" : "",
      image: !articlePayload.image ? "Bilde er påkrevd" : "",
      category: !articlePayload.category ? "Kategori er påkrevd" : "",
      imageUrl: "",
    };

    setErrorMessage(validationErrors);

    const isFormValid = !Object.values(validationErrors).some((error) => error);

    if (isFormValid) {
      // Build FormData for file upload
      const formData = new FormData();
      formData.append("title", articlePayload.title);
      formData.append("category", articlePayload.category);
      formData.append("content", articlePayload.content);
      if (articlePayload.image) {
        formData.append("image", articlePayload.image);
      }

      await api.mutate(formData);
    }
  }

  function handleResetForm() {
    setArticlePayload(INITIAL_ARTICLE);
    setErrorMessage({
      title: "",
      image: "",
      category: "",
      imageUrl: "",
      content: "",
    });
    setImagePreview(null);
  }

  return (
    <>
      <h1 style={{ marginBottom: "1em" }}>Opprett artikkel</h1>
      <form onSubmit={handleRequestSubmit} encType="multipart/form-data">
        <StackLayout>
          <InputField
            label="Tittel"
            type="text"
            placeholder="Skriv tittel"
            value={articlePayload.title}
            onChange={handleChangePayload}
            data-state="title"
            errorMessage={errorMessage.title}
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

          <SelectField
            label="Kategori"
            value={articlePayload.category}
            onChange={handleChangePayload}
            data-state="category"
            options={ARTICLE_CATEGORIES}
            errorMessage={errorMessage.category}
          />

          <TextAreaField
            label="Innhold"
            placeholder="Skriv innhold"
            value={articlePayload.content}
            onChange={handleChangePayload}
            data-state="content"
            errorMessage={errorMessage.content}
          />

          <ClusterLayout>
            <button type="submit" title="publiser">
              Publiser
            </button>
            <button type="reset" onClick={handleResetForm} title="Annuller">
              Annuller
            </button>
          </ClusterLayout>
        </StackLayout>
      </form>
    </>
  );
};

export default CreateArticle;
