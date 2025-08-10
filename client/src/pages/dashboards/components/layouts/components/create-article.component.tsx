import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import CenterLayout from "@/components/compositions/center-layouts/center-layout.component";
import BoxLayout from "@/components/compositions/box-layouts/box-layout.component";
import WrapperLayout from "@/components/compositions/wrapper-layouts/wrapper-layout.component";
import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";

import { useApi } from "@/hooks/use-api";

const INITIAL_ARTICLE = {
  title: "",
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
    >,
  ) {
    const state = event.target.dataset.state as
      | "title"
      | "category"
      | "content";
    const currentValue = event.target.value;

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
      category: !articlePayload.category ? "Kategori er påkrevd" : "",
    };

    setErrorMessage(validationErrors);

    const isFormValid = !Object.values(validationErrors).some((error) => error);

    if (isFormValid) {
      api.mutate(articlePayload);
    }
  }

  return (
    <CenterLayout max="50em">
      <WrapperLayout maxWidth="50em">
        <BoxLayout paddingBlock="5em">
          <h1 style={{ marginBottom: "1em" }}>Opprett artikkel</h1>
          <form onSubmit={handleRequestSubmit}>
            <StackLayout>
              <label htmlFor="tittel">Tittel</label>
              <input
                type="text"
                id="tittel"
                placeholder="tittel"
                value={articlePayload.title}
                onChange={handleChangePayload}
                data-state="title"
              />
              {errorMessage.title && (
                <p style={{ color: "red" }}>Tittel er påkrevd</p>
              )}

              <label htmlFor="category">Choose a pet:</label>

              <select
                id="category"
                value={articlePayload.category}
                onChange={handleChangePayload}
                data-state="category"
              >
                <option value="">--Please choose an option--</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="hamster">Hamster</option>
                <option value="parrot">Parrot</option>
                <option value="spider">Spider</option>
                <option value="goldfish">Goldfish</option>
              </select>

              {errorMessage.category && (
                <p style={{ color: "red" }}>Kategori er påkrevd</p>
              )}

              <label htmlFor="innhold">Innhold</label>
              <textarea
                id="innhold"
                placeholder="Skriv innhold"
                rows={30}
                cols={30}
                value={articlePayload.content}
                onChange={handleChangePayload}
                data-state="content"
              />

              {errorMessage.content && (
                <p style={{ color: "red" }}>Innhold er påkrevd</p>
              )}

              <button type="submit" style={{ width: "fit-content" }}>
                Publiser
              </button>
            </StackLayout>
          </form>
        </BoxLayout>
      </WrapperLayout>
    </CenterLayout>
  );
};

export default CreateArticle;
