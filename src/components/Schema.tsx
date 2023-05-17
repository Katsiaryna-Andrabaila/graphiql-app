import { useState } from 'react';
import { Args, Field, QueryType } from '../types/types';

export const Schema = ({ query }: { query: QueryType[] }) => {
  const [isQueryOpen, setIsQueryOpen] = useState(false);
  const [isFieldOpen, setIsFieldOpen] = useState(false);
  const [field, setField] = useState<Field | null>(null);
  const [header, setHeader] = useState<string | Field | QueryType>('Docs');
  const [type, setType] = useState<QueryType | null>(null);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [nestedType, setNestedType] = useState<QueryType | null>(null);
  const [isNestedTypeOpen, setIsNestedTypeOpen] = useState(false);
  const [scalarType, setScalarType] = useState<QueryType | null>(null);

  const handleClickHeader = () => {
    switch (header) {
      case 'Docs':
        setIsQueryOpen(false);
        break;
      case query[0].name:
        setIsFieldOpen(false);
        setIsQueryOpen(true);
        setHeader('Docs');
        break;
      case field?.name:
        setIsTypeOpen(false);
        setIsFieldOpen(true);
        setIsQueryOpen(false);
        setHeader(query[0].name);
        break;
      case type?.name:
        setIsNestedTypeOpen(false);
        setIsTypeOpen(true);
        setIsFieldOpen(false);
        field ? setHeader(field.name) : setHeader(query[0].name);
        break;
      case nestedType?.name:
        setScalarType(null);
        setIsNestedTypeOpen(true);
        setIsTypeOpen(false);
        setHeader(type!.name);
        break;
    }
  };

  const handleClickField = (type: Field) => {
    if (isFieldOpen) {
      setIsFieldOpen(false);
      setIsQueryOpen(true);
    } else {
      setIsFieldOpen(true);
      setIsQueryOpen(false);
      setField(type);
      setHeader(query[0].name);
    }
  };

  const handleClickType = (event: React.MouseEvent<HTMLAnchorElement>, type?: string) => {
    if (event.target instanceof HTMLAnchorElement) {
      const value = event.target.innerText;
      const targetType = query.find((el) => el.name === value);
      if (targetType) {
        if (type === 'type') {
          setType(targetType);
        } else if (type === 'nested') {
          setNestedType(targetType);
        } else if (type === 'scalar') {
          setScalarType(targetType);
        }
      }
      setIsQueryOpen(false);
      setIsFieldOpen(false);
    }
  };

  const getArgs = (args: Args[]) =>
    args.map((item) => (
      <div key={item.name} className="argument">
        <span>{item.name}</span>:{' '}
        {item.type.kind === 'NON_NULL' && item.name !== 'ids' ? (
          <span>
            <a>{item.type.ofType.name}</a>!
          </span>
        ) : item.type.kind === 'NON_NULL' && item.name === 'ids' ? (
          <span>
            [<a>{item.type.ofType.ofType.ofType.name}</a>!]!
          </span>
        ) : (
          <a>{item.type.name}</a>
        )}
      </div>
    ));

  return (
    <section className="schema">
      {!isQueryOpen && !isFieldOpen && !isTypeOpen && !isNestedTypeOpen && !scalarType ? (
        <>
          <h3>Docs</h3>
          <p>A GraphQL schema provides a root type for each kind of operation.</p>
          <p>~ Root types</p>
          <p>
            query: <a onClick={() => setIsQueryOpen((status) => !status)}>{query[0].name}</a>
          </p>
        </>
      ) : (
        <>
          <a onClick={handleClickHeader}>{`< ${header}`}</a>
        </>
      )}

      {isQueryOpen && (
        <div>
          <p>{query[0].name}</p>
          <p>▪ Fields</p>
          {query[0].fields.map((el: Field) => (
            <div key={el.name} className="type">
              <a onClick={() => handleClickField(el)}>{el.name}</a>({getArgs(el.args)}
              ):{' '}
              {el.type.kind === 'LIST' ? (
                <span>
                  [
                  <a
                    onClick={(e) => {
                      handleClickType(e, 'type');
                      setIsTypeOpen(true);
                      setHeader(query[0].name);
                      setField(null);
                    }}
                  >
                    {el.type.ofType.name}
                  </a>
                  ]
                </span>
              ) : (
                <a
                  onClick={(e) => {
                    handleClickType(e, 'type');
                    setIsTypeOpen(true);
                    setHeader(query[0].name);
                    setField(null);
                  }}
                >
                  {el.type.name}
                </a>
              )}
              <p>{el.description}</p>
            </div>
          ))}
        </div>
      )}

      {isFieldOpen && field && (
        <>
          <h4>{field.name}</h4>
          <p>{field.description}</p>
          <p>▪ Type</p>
          {field.type.kind === 'LIST' ? (
            <span>
              [
              <a
                onClick={(e) => {
                  handleClickType(e, 'type');
                  setIsTypeOpen(true);
                  field && setHeader(field.name);
                }}
              >
                {field.type.ofType.name}
              </a>
              ]
            </span>
          ) : (
            <a
              onClick={(e) => {
                handleClickType(e, 'type');
                setIsTypeOpen(true);
                field && setHeader(field.name);
              }}
            >
              {field.type.name}
            </a>
          )}
          <p>▪ Arguments</p>
          {getArgs(field.args)}
        </>
      )}

      {isTypeOpen && type && (
        <>
          <h4>{type.name}</h4>
          {type.fields ? (
            <>
              <p>▪ Fields</p>
              {type.fields.map((el: Field) => (
                <div key={el.name}>
                  <p>
                    <span>{el.name}</span>:{' '}
                    {el.type.kind === 'NON_NULL' ? (
                      <span>
                        [
                        <a
                          onClick={(e) => {
                            handleClickType(e, 'nested');
                            setIsTypeOpen(false);
                            setIsNestedTypeOpen(true);
                            setHeader(type.name);
                          }}
                        >
                          {el.type.ofType.ofType.name}
                        </a>
                        ]!
                      </span>
                    ) : el.type.kind === 'LIST' ? (
                      <span>
                        [
                        <a
                          onClick={(e) => {
                            handleClickType(e, 'nested');
                            setIsTypeOpen(false);
                            setIsNestedTypeOpen(true);
                            setHeader(type.name);
                          }}
                        >
                          {el.type.ofType.name}
                        </a>
                        ]
                      </span>
                    ) : (
                      <a
                        onClick={(e) => {
                          handleClickType(e, 'nested');
                          setIsTypeOpen(false);
                          setIsNestedTypeOpen(true);
                          setHeader(type.name);
                        }}
                      >
                        {el.type.name}
                      </a>
                    )}
                  </p>
                  <p>{el.description}</p>
                </div>
              ))}
            </>
          ) : (
            <p>{type.description}</p>
          )}
        </>
      )}

      {isNestedTypeOpen && nestedType && (
        <>
          <h4>{nestedType.name}</h4>
          {nestedType.fields ? (
            <>
              <p>▪ Fields</p>
              {nestedType.fields.map((el: Field) => (
                <div key={el.name}>
                  <p>
                    <span>{el.name}</span>:{' '}
                    {
                      <a
                        onClick={(e) => {
                          handleClickType(e, 'scalar');
                          setIsNestedTypeOpen(false);
                          setHeader(nestedType.name);
                        }}
                      >
                        {el.type.name}
                      </a>
                    }
                  </p>
                  <p>{el.description}</p>
                </div>
              ))}
            </>
          ) : (
            <p>{nestedType.description}</p>
          )}
        </>
      )}

      {scalarType && (
        <>
          <h4>{scalarType.name}</h4>
          {<p>{scalarType.description}</p>}
        </>
      )}
    </section>
  );
};
