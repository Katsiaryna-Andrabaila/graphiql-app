import { lazy, useContext } from 'react';
import { MutableRefObject, Suspense, useEffect, useRef, useState, MouseEvent } from 'react';
import { getIntrospectionQuery, IntrospectionQuery } from 'graphql';
import { Uri, editor, KeyMod, KeyCode, languages } from 'monaco-editor';
import { initializeMode } from 'monaco-graphql/esm/initializeMode';
import { SideMenu } from '../../components/sideMenu';
import { ActionIcon, Stack, useMantineColorScheme } from '@mantine/core';
import { createFetcher } from '../../utils/createFetcher';
import { AppLoader } from '../../components/AppLoader';
import { BASE_URL, SCHEMA_ERROR } from '../../constants/constants';
import { historyButtonsStyles, historyStyles } from './styles';
import { notifications } from '@mantine/notifications';
import { AppContext } from '../../HOC/Provider';
import { IconExclamationMark } from '@tabler/icons-react';
const Documentation = lazy(() => import('../../components/docs/Documentation'));

const fetcher = createFetcher({
  url: BASE_URL,
});

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
  const [isOpenDocs, setIsOpenDocs] = useState(false);
  const [isOpenHistory, setIsOpenHistory] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  const { colorScheme } = useMantineColorScheme();

  const prettify = () => {
    queryEditor?.getAction('editor.action.formatDocument')?.run();
  };
  const { history, setHistory } = useContext(AppContext);

  const adaptiveEditor = () => {
    var x = window.matchMedia('(max-width: 700px)');
    if (x.matches) {
      const lineHeightQueryEditor =
        (queryEditor && queryEditor.getOption(editor.EditorOption.lineHeight)) || 20;
      const lineCountQueryEditor = (queryEditor && queryEditor!.getModel()?.getLineCount()) || 1;
      const heightQueryEditor = lineHeightQueryEditor * lineCountQueryEditor + 20;

      const lineHeightresultsViewer =
        (resultsViewer && resultsViewer.getOption(editor.EditorOption.lineHeight)) || 20;
      const lineCountresultsViewer =
        (resultsViewer && resultsViewer!.getModel()?.getLineCount()) || 1;
      const heightresultsViewer = lineHeightresultsViewer * lineCountresultsViewer + 20;

      if (opsRef.current) {
        (opsRef.current as HTMLElement).style.width = '85vw';
        (opsRef.current as HTMLElement).style.height = `${heightQueryEditor}px`;
        queryEditor && queryEditor.layout();
      }
      if (varsRef.current) {
        (varsRef.current as HTMLElement).style.width = '85vw';
        (varsRef.current as HTMLElement).style.height = '150px';
        variablesEditor && variablesEditor.layout();
      }
      if (resultsRef.current) {
        (resultsRef.current as HTMLElement).style.width = '85vw';
        (resultsRef.current as HTMLElement).style.height = `${heightresultsViewer}px`;
        resultsViewer && resultsViewer.layout();
      }
    } else {
      if (opsRef.current) {
        (opsRef.current as HTMLElement).style.width = '100%';
        (opsRef.current as HTMLElement).style.height = '';
        queryEditor && queryEditor.layout();
      }
      if (varsRef.current) {
        (varsRef.current as HTMLElement).style.width = '100%';
        (varsRef.current as HTMLElement).style.height = '';
        variablesEditor && variablesEditor.layout();
      }
      if (resultsRef.current) {
        (resultsRef.current as HTMLElement).style.width = '100%';
        (resultsRef.current as HTMLElement).style.height = '97.6vw';
        resultsViewer && resultsViewer.layout();
      }
    }
  };
  let prevHeight = 0;

  const updateEditorHeight = () => {
    const editorElement = resultsViewer!.getDomNode();
    if (!editorElement) {
      return;
    }
    const lineHeight = resultsViewer!.getOption(editor.EditorOption.lineHeight);

    const lineCount = resultsViewer!.getModel()?.getLineCount() || 1;
    const height = resultsViewer!.getTopForLineNumber(lineCount + 1) + lineHeight;
    if (prevHeight !== height) {
      prevHeight = height;
      if (resultsRef.current) {
        (resultsRef.current as HTMLElement).style.height = `${height}px`;
        resultsViewer!.layout();
      }
    }
  };

  const execOperation = async function () {
    try {
      notifications.clean();
      const variables = editor.getModel(Uri.file('variables.json'))!.getValue();
      const operations = editor.getModel(Uri.file('operation.graphql'))!.getValue();
      const resultsModel = editor.getModel(Uri.file('results.json'));

      const result = await fetcher({
        query: operations,
        variables: JSON.parse(variables),
      });

      if (history[history.length - 1].query !== operations) {
        setHistory &&
          setHistory([
            ...history,
            {
              query: operations,
              variables: variables,
              id: String(history.length),
            },
          ]);
      }

      localStorage.setItem('history', JSON.stringify(history));

      const data = result;
      resultsModel?.setValue(JSON.stringify(data, null, 2));

      if (window.innerWidth < 750) {
        resultsViewer &&
          resultsViewer.onDidContentSizeChange(() => {
            updateEditorHeight();
            requestAnimationFrame(updateEditorHeight);
          });
      }
    } catch (e) {
      notifications.show({
        id: 'api-error',
        loading: false,
        message: `${e}`,
        color: 'red',
        icon: <IconExclamationMark size="3rem" color="black" />,
        autoClose: false,
        style: { backgroundColor: '#fa5252' },
      });
    }
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
    const queryModel = getOrCreateModel('operation.graphql', history[history.length - 1].query);
    const variablesModel = getOrCreateModel(
      'variables.json',
      history[history.length - 1].variables
    );
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
  }, []);

  useEffect(() => {
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
          if (data) {
            if (!('data' in data)) {
              throw Error(SCHEMA_ERROR);
            }
            initializeMode({
              diagnosticSettings: {
                validateVariablesJSON: {
                  [Uri.file('operation.graphql').toString()]: [
                    Uri.file('variables.json').toString(),
                  ],
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
          }

          return;
        })
        .then(() => setLoading(false));
    }
  }, [schema, loading]);

  const handleClickDocs = () => {
    isOpenHistory && setIsOpenHistory(false);
    setIsOpenDocs((status) => !status);
  };
  const handleClickHistory = () => {
    isOpenDocs && setIsOpenDocs(false);
    setIsOpenHistory((status) => !status);
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
    const currentObject = history.find((item) => item.id === (e.target as HTMLButtonElement).id);
    if (currentObject) {
      queryEditor && queryEditor.setValue(currentObject.query);
      variablesEditor && variablesEditor.setValue(currentObject.variables);
      resultsViewer && resultsViewer.setValue('{}');
    }
  };

  window.addEventListener(`resize`, adaptiveEditor);

  return (
    <>
      <div className="redactor-wrapper">
        <SideMenu
          isOpenSchema={isOpenDocs}
          showVariables={showVariables}
          variablesHandler={variablesHandler}
          handleClickSchema={handleClickDocs}
          execOperation={execOperation}
          prettify={prettify}
          handleClickHistory={handleClickHistory}
        />
        {isOpenDocs && (
          <section className="schema">
            <Suspense fallback={<AppLoader />}>
              {schema !== null && (
                <Documentation
                  query={JSON.parse(JSON.stringify(schema, null, '\t'))['__schema']['types']}
                />
              )}
            </Suspense>
          </section>
        )}
        {isOpenHistory && (
          <Stack sx={historyStyles}>
            {history.map((el) => {
              return (
                <ActionIcon
                  onClick={handleHistory}
                  id={el.id}
                  key={el.id}
                  sx={historyButtonsStyles}
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
