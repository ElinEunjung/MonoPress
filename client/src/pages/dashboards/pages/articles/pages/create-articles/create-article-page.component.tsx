import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";

import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";
import { useApi } from "@/hooks/use-api";

import InputField from "@/components/forms/input-field.component";
import SelectField from "@/components/forms/select-field.component";
import TextAreaField from "@/components/forms/textarea-field.component";
import { ARTICLE_CATEGORIES } from "../models/constants/article-categories.constant";

const INITIAL_ARTICLE = {
  title: "",
  image: "",
  category: "",
  content: "",
};

const CreateArticle = () => {
  const [errorMessage, setErrorMessage] = useState(INITIAL_ARTICLE);
  const [articlePayload, setArticlePayload] = useState(INITIAL_ARTICLE);

  const api = useApi("/news", {
    method: "post",
  });

  useEffect(() => {
    if (api.isSuccess) {
      alert("Artikkelen ble opprettet");
      setArticlePayload(INITIAL_ARTICLE);
    }
  }, [api.isSuccess]);

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
    let currentValue = event.target.value;

    if (state === "image") {
      currentValue = (event.target as HTMLInputElement).files;
    }

    console.log("currentValue", currentValue);

    setArticlePayload((prev) => {
      return {
        ...prev,
        [state]: currentValue,
      };
    });
  }

  function handleRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = {
      title: !articlePayload.title ? "Tittel er påkrevd" : "",
      content: !articlePayload.content ? "Innhold er påkrevd" : "",
      image: !articlePayload.image ? "Bilde er påkrevd" : "",
      category: !articlePayload.category ? "Kategori er påkrevd" : "",
    };

    setErrorMessage(validationErrors);

    const isFormValid = !Object.values(validationErrors).some((error) => error);

    if (isFormValid) {
      api.mutate(articlePayload);
    }
  }

  return (
    <>
      <h1 style={{ marginBottom: "1em" }}>Opprett artikkel</h1>
      <form onSubmit={handleRequestSubmit}>
        <StackLayout>
          <InputField
            label="Tittel"
            type="text"
            placeholder="Skriv tittel"
            value={articlePayload.title}
            onChange={handleChangePayload}
            data-state="title"
            errorMessage={errorMessage.title && "Tittel er påkrevd"}
          />

          <InputField
            label="Last opp bilde"
            type="file"
            placeholder="Last opp ett bilde"
            value={articlePayload.image}
            onChange={handleChangePayload}
            data-state="image"
            errorMessage={errorMessage.image && "Bilde er påkrevd"}
          />

          <SelectField
            label="Kategori"
            value={articlePayload.category}
            onChange={handleChangePayload}
            data-state="category"
            options={ARTICLE_CATEGORIES}
            errorMessage={errorMessage.category && "Kategori er påkrevd"}
          />

          <TextAreaField
            label="Innhold"
            placeholder="Skriv innhold"
            value={articlePayload.content}
            onChange={handleChangePayload}
            data-state="content"
            errorMessage={errorMessage.content && "Innhold er påkrevd"}
          />

          <button
            type="submit"
            style={{ width: "fit-content" }}
            title="publiser"
          >
            Publiser
          </button>
        </StackLayout>
      </form>
    </>
  );
};

export default CreateArticle;
