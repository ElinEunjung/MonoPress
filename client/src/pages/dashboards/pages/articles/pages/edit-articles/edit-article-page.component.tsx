import { useParams, useOutletContext } from "react-router";
import { useApi } from "@/hooks/use-api";

import InputField from "@/components/forms/input-field.component";
import SelectField from "@/components/forms/select-field.component";
import TextAreaField from "@/components/forms/textarea-field.component";
import type { News } from "@/types/news.type";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";
import { ARTICLE_CATEGORIES } from "../models/constants/article-categories.constant";

const EditArticlePage = () => {
  const params = useParams<{ id: string }>();
  const newsData = useOutletContext<News[]>();

  const currentNews = newsData?.find((newsDatum) => newsDatum.id === params.id);

  const [errorMessage, setErrorMessage] = useState<{
    title?: string;
    category?: string;
    content?: string;
  }>({});

  const [articlePayload, setArticlePayload] = useState<News | undefined>(
    currentNews,
  );

  const api = useApi(`/news/${params.id}`, { method: "put" });

  useEffect(() => {
    if (api.isSuccess) {
      alert("Artikkelen ble oppdatert");
    }
  }, [api.isSuccess]);

  function handleChangePayload(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const state = event.target.dataset.state as
      | "title"
      | "category"
      | "content";
    const currentValue = event.target.value;

    setArticlePayload((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [state]: currentValue,
      };
    });
  }

  function handleRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!articlePayload) return;

    const validationErrors = {
      title: !articlePayload.title ? "Tittel er påkrevd" : "",
      content: !articlePayload.content ? "Innhold er påkrevd" : "",
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
      <h1 style={{ marginBottom: "1em" }}>Endre artikkel</h1>
      <form onSubmit={handleRequestSubmit}>
        <StackLayout>
          <InputField
            label="Tittel"
            type="text"
            placeholder="Skriv tittel"
            value={articlePayload?.title}
            onChange={handleChangePayload}
            data-state="title"
            errorMessage={errorMessage.title || ""}
          />

          <SelectField
            label="Kategori"
            value={articlePayload?.category}
            onChange={handleChangePayload}
            data-state="category"
            options={ARTICLE_CATEGORIES}
            errorMessage={errorMessage.category || ""}
          />

          <TextAreaField
            label="Innhold"
            value={articlePayload?.content}
            placeholder="Skriv inn innhold"
            onChange={handleChangePayload}
            data-state="content"
            errorMessage={errorMessage?.content && "Innhold er påkrevd"}
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
