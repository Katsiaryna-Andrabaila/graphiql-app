import { MutableRefObject, useEffect, useRef, useState, MouseEvent } from 'react';
import { getIntrospectionQuery, IntrospectionQuery } from 'graphql';
import { Uri, editor, KeyMod, KeyCode, languages } from 'monaco-editor';
import { initializeMode } from 'monaco-graphql/esm/initializeMode';
import { SideMenu } from '../components/sideMenu';
import { ActionIcon, Stack, useMantineColorScheme } from '@mantine/core';
import { createFetcher } from '../utils/createFetcher';
import { HistoryObject } from '../types/types';

const fetcher = createFetcher({
  url: 'https://rickandmortyapi.com/graphql/',
});

export const defaultValues = {
  query: `query {
characters(page: 2, filter: { name: "rick" }) {
info {
  count
}
results {
  name
}
}
location(id: 1) {
id
}
episodesByIds(ids: [1, 2]) {
id
}
}`,
  variables: `
{

}
`,
  id: '0',
};

const getSchema = async () =>
  fetcher({
    query: getIntrospectionQuery(),
    operationName: 'IntrospectionQuery',
  });

const getOrCreateModel = (uri: string, value: string) => {
  return (
    editor.getModel(Uri.file(uri)) ?? editor.createModel(value, uri.split('.').pop(), Uri.file(uri))
  );
};

languages.json.jsonDefaults.setDiagnosticsOptions({
  allowComments: true,
  trailingCommas: 'ignore',
});

const createEditor = (
  ref: MutableRefObject<null>,
  options: editor.IStandaloneEditorConstructionOptions
) => editor.create(ref.current as unknown as HTMLElement, options);

const RedactorPage = () => {
  const opsRef = useRef(null);
  const varsRef = useRef(null);
  const resultsRef = useRef(null);
  const [queryEditor, setQueryEditor] = useState<editor.IStandaloneCodeEditor | null>(null);
  const [variablesEditor, setVariablesEditor] = useState<editor.IStandaloneCodeEditor | null>(null);
  const [resultsViewer, setResultsViewer] = useState<editor.IStandaloneCodeEditor | null>(null);
  const [schema, setSchema] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpenSchema, setIsOpenSchema] = useState(false);
  const [isOpenHistory, setIsOpenHistory] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const [historyArray, setHistoryArray] = useState<HistoryObject[]>(
    localStorage.getItem('history') && JSON.parse(localStorage.getItem('history')!).length > 0
      ? JSON.parse(localStorage.getItem('history')!)
      : [defaultValues]
  );

  let defaultOperations =
    (historyArray.length > 0 && historyArray[historyArray.length - 1].query) || defaultValues.query;

  const defaultVariables =
    (historyArray.length > 0 && historyArray[historyArray.length - 1].variables) ||
    defaultValues.variables;

  const execOperation = async function () {
    const variables = editor.getModel(Uri.file('variables.json'))!.getValue();
    const operations = editor.getModel(Uri.file('operation.graphql'))!.getValue();
    const resultsModel = editor.getModel(Uri.file('results.json'));

    const result = await fetcher({
      query: operations,
      variables: JSON.parse(variables),
    });

    if (historyArray[historyArray.length - 1].query !== operations) {
      setHistoryArray([
        ...historyArray,
        {
          query: operations,
          variables: variables,
          id: String(historyArray.length),
        },
      ]);
    }

    localStorage.setItem('history', JSON.stringify(historyArray));

    const data = result;
    resultsModel?.setValue(JSON.stringify(data, null, 2));
  };

  const queryAction = {
    id: 'graphql-run',
    label: 'Run Operation',
    contextMenuOrder: 0,
    contextMenuGroupId: 'graphql',
    keybindings: [KeyMod.CtrlCmd | KeyCode.Enter],
    run: execOperation,
  };

  useEffect(() => {
    const queryModel = getOrCreateModel('operation.graphql', defaultOperations);
    const variablesModel = getOrCreateModel('variables.json', defaultVariables);
    const resultsModel = getOrCreateModel('results.json', '{}');

    queryEditor ??
      setQueryEditor(
        createEditor(opsRef, {
          theme: colorScheme === 'dark' ? 'vs-dark' : 'hc-light',
          model: queryModel,
          language: 'graphql',
        })
      );

    variablesEditor ??
      setVariablesEditor(
        createEditor(varsRef, {
          theme: colorScheme === 'dark' ? 'vs-dark' : 'hc-light',
          model: variablesModel,
        })
      );

    resultsViewer ??
      setResultsViewer(
        createEditor(resultsRef, {
          theme: colorScheme === 'dark' ? 'vs-dark' : 'hc-light',
          model: resultsModel,
          readOnly: true,
          smoothScrolling: true,
        })
      );

    const themeColor = colorScheme === 'dark' ? 'vs-dark' : 'hc-light';
    editor.setTheme(themeColor);
  }, [colorScheme]);

  useEffect(() => {
    queryEditor?.addAction(queryAction);
    variablesEditor?.addAction(queryAction);
  }, [variablesEditor]);

  useEffect(() => {
    if (!schema && !loading) {
      setLoading(true);
      getSchema()
        .then((data) => {
          if (!('data' in data)) {
            throw Error('this demo does not support subscriptions or http multipart yet');
          }
          initializeMode({
            diagnosticSettings: {
              validateVariablesJSON: {
                [Uri.file('operation.graphql').toString()]: [Uri.file('variables.json').toString()],
              },
              jsonDiagnosticSettings: {
                validate: true,
                schemaValidation: 'error',
                allowComments: true,
                trailingCommas: 'ignore',
              },
            },
            schemas: [
              {
                introspectionJSON: data.data as unknown as IntrospectionQuery,
                uri: 'myschema.graphql',
              },
            ],
          });

          setSchema(data.data);

          return;
        })
        .then(() => setLoading(false));
    }
  }, [schema, loading]);

  const handleClickSchema = () => {
    !isOpenSchema ? setIsOpenSchema(true) : setIsOpenSchema(false);
  };
  const handleClickHistory = () => {
    !isOpenHistory ? setIsOpenHistory(true) : setIsOpenHistory(false);
  };

  const variablesHandler = () => {
    if (varsRef.current) {
      if (!showVariables) {
        (varsRef.current as HTMLElement).style.display = 'none';
      } else {
        (varsRef.current as HTMLElement).style.display = '';
      }
    }
    setShowVariables(!showVariables);
    queryEditor && queryEditor.layout();
  };

  const handleHistory = (e: MouseEvent<HTMLButtonElement>) => {
    const currentObject = historyArray.find(
      (item) => item.id === (e.target as HTMLButtonElement).id
    );
    if (currentObject) {
      queryEditor && queryEditor.setValue(currentObject.query);
      variablesEditor && variablesEditor.setValue(currentObject.variables);
      resultsViewer && resultsViewer.setValue('{}');
    }
  };

  return (
    <>
      <div className="redactor-wrapper">
        <SideMenu
          isOpenSchema={isOpenSchema}
          showVariables={showVariables}
          variablesHandler={variablesHandler}
          handleClickSchema={handleClickSchema}
          execOperation={execOperation}
          handleClickHistory={handleClickHistory}
        />
        {isOpenSchema && <div className="schema">{JSON.stringify(schema, null, '\t')}</div>}
        {isOpenHistory && (
          <Stack sx={{ maxWidth: '25%', width: '25%', padding: '1rem', gap: '0' }}>
            {historyArray.map((el) => {
              return (
                <ActionIcon
                  onClick={handleHistory}
                  id={el.id}
                  key={el.id}
                  sx={{
                    justifyContent: 'start',
                    width: '90%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '0.75rem',
                  }}
                >
                  {el.query}
                </ActionIcon>
              );
            })}
          </Stack>
        )}
        <div
          id="wrapper"
          style={{ backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#efe9e9' }}
        >
          <div id="left-pane" className="pane">
            <div
              ref={opsRef}
              className="ops-editor"
              style={{ backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#ffffff' }}
            />
            <div
              ref={varsRef}
              className="vars-editor"
              style={{ backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#ffffff' }}
            >
              Variables
            </div>
          </div>
          <div id="right-pane" className="pane">
            <div
              ref={resultsRef}
              className="result-editor"
              style={{ backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#ffffff' }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default RedactorPage;
