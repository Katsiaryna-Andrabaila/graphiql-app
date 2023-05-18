import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { getIntrospectionQuery, IntrospectionQuery } from 'graphql';
import { Uri, editor, KeyMod, KeyCode, languages } from 'monaco-editor';
import { initializeMode } from 'monaco-graphql/esm/initializeMode';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import * as JSONC from 'jsonc-parser';
import { debounce } from '../utils/debounce';
import { SideMenu } from '../components/sideMenu';
import { useMantineColorScheme } from '@mantine/core';

const fetcher = createGraphiQLFetcher({
  url: 'https://rickandmortyapi.com/graphql/',
});

const defaultOperations =
  localStorage.getItem('operations') ??
  `
# cmd/ctrl + return/enter will execute the op,
# same in variables editor below
# also available via context menu & f1 command palette

query {
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
}
`;

const defaultVariables =
  localStorage.getItem('variables') ??
  `
 {
     // limit will appear here as autocomplete,
     // and because the default value is 0, will
     // complete as such
     "limit": false
 }
`;

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

const execOperation = async function () {
  const variables = editor.getModel(Uri.file('variables.json'))!.getValue();
  const operations = editor.getModel(Uri.file('operation.graphql'))!.getValue();
  const resultsModel = editor.getModel(Uri.file('results.json'));

  const result = await fetcher({
    query: operations,
    variables: JSON.stringify(JSONC.parse(variables)),
  });

  // @ts-expect-error
  const data = await result.next();

  resultsModel?.setValue(JSON.stringify(data.value, null, 2));
};

const queryAction = {
  id: 'graphql-run',
  label: 'Run Operation',
  contextMenuOrder: 0,
  contextMenuGroupId: 'graphql',
  keybindings: [
    // eslint-disable-next-line no-bitwise
    KeyMod.CtrlCmd | KeyCode.Enter,
  ],
  run: execOperation,
};
// set these early on so that initial variables with comments don't flash an error
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
  const [showVariables, setShowVariables] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  /**
   * Create the models & editors
   */
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

    queryModel.onDidChangeContent(
      debounce(300, () => {
        localStorage.setItem('operations', queryModel.getValue());
      })
    );
    variablesModel.onDidChangeContent(
      debounce(300, () => {
        localStorage.setItem('variables', variablesModel.getValue());
      })
    );

    // only run once on mount
  }, []);

  useEffect(() => {
    queryEditor?.addAction(queryAction);
    variablesEditor?.addAction(queryAction);
  }, [variablesEditor]);
  /**
   * Handle the initial schema load
   */
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
                // set these again, because we are entirely re-setting them here
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

  return (
    <>
      <div className="redactor-wrapper">
        <SideMenu
          isOpenSchema={isOpenSchema}
          showVariables={showVariables}
          variablesHandler={variablesHandler}
          handleClickSchema={handleClickSchema}
          execOperation={execOperation}
        />
        {isOpenSchema && <div className="schema">{JSON.stringify(schema, null, '\t')}</div>}
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
