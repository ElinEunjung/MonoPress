import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";

import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";
import { useApi } from "@/hooks/use-api";

import InputField from "@/components/forms/input-field.component";
import SelectField from "@/components/forms/select-field.component";
import TextAreaField from "@/components/forms/textarea-field.component";
import { ARTICLE_CATEGORIES } from "../models/constants/article-categories.constant";

type ArticlePayload = {
  title: string;
  image: string | File | null;
  category: string;
  imageUrl: string;
  content: string;
};

type ArticleErrors = {
  title: string;
  image: string;
  category: string;
  imageUrl: string;
  content: string;
};

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
    >
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

  console.log(errorMessage);

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

          {/* Use a native input for file upload to ensure file object is passed */}
          <div className="form-group">
            <label htmlFor="file-input">Last opp bilde</label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleChangePayload}
              data-state="image"
            />
            {typeof errorMessage.image === "string" && errorMessage.image && (
              <span style={{ color: "red" }}>{errorMessage.image}</span>
            )}
          </div>

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

          <button
            type="submit"
            style={{ width: "fit-content" }}
            title="publiser"
            disabled={!articlePayload.image}
          >
            Publiser
          </button>
        </StackLayout>
      </form>
    </>
  );
};

export default CreateArticle;
