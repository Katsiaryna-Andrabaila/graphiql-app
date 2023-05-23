import { useState } from 'react';
import { Args, Field, QueryType } from '../../types/types';

const Documentation = ({ query }: { query: QueryType[] }) => {
  const [isQueryOpen, setIsQueryOpen] = useState(false);
  const [isFieldOpen, setIsFieldOpen] = useState(false);
  const [field, setField] = useState<Field | null>(null);
  const [header, setHeader] = useState<string | Field | QueryType>('Docs');
  const [type, setType] = useState<QueryType | null>(null);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [nestedType, setNestedType] = useState<QueryType | null>(null);
  const [isNestedTypeOpen, setIsNestedTypeOpen] = useState(false);
  const [scalarType, setScalarType] = useState<QueryType | null>(null);
  const [fieldDetails, setFieldDetails] = useState<Field | null>(null);
  const [isFieldDetailsOpen, setIsFieldDetailsOpen] = useState(false);

  const handleClickHeader = () => {
    switch (header) {
      case 'Docs':
        setIsQueryOpen(false);
        setIsFieldOpen(false);
        setIsTypeOpen(false);
        setIsNestedTypeOpen(false);
        setIsFieldDetailsOpen(false);
        break;
      case query[0].name:
        setIsFieldOpen(false);
        setIsTypeOpen(false);
        setIsNestedTypeOpen(false);
        setIsQueryOpen(true);
        setType(null);
        setNestedType(null);
        setScalarType(null);
        setHeader('Docs');
        break;
      case field?.name:
        setIsTypeOpen(false);
        setIsFieldOpen(true);
        setIsQueryOpen(false);
        setScalarType(null);
        setHeader(query[0].name);
        break;
      case type?.name:
        setIsNestedTypeOpen(false);
        setIsTypeOpen(true);
        setIsFieldOpen(false);
        setFieldDetails(null);
        field ? setHeader(field.name) : setHeader(query[0].name);
        break;
      case nestedType?.name:
        setScalarType(null);
        setFieldDetails(null);
        setIsNestedTypeOpen(true);
        setIsTypeOpen(false);
        type ? setHeader(type.name) : setHeader(query[0].name);
        break;
      case fieldDetails?.name:
        setIsFieldDetailsOpen(true);
        setIsNestedTypeOpen(false);
        setIsTypeOpen(false);
        setIsFieldOpen(false);
        nestedType ? setHeader(nestedType.name) : setHeader(type!.name);
        setScalarType(null);
        break;
      case scalarType?.name:
        setScalarType(null);
        fieldDetails ? setHeader(fieldDetails.name) : setHeader(nestedType!.name);
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

  const handleClickType = (
    event: React.MouseEvent<HTMLAnchorElement>,
    type: 'type' | 'nested' | 'scalar'
  ) => {
    if (event.target instanceof HTMLAnchorElement) {
      const value = event.target.innerText;
      const targetType = query.find((el) => el.name === value);
      if (targetType) {
        switch (type) {
          case 'type':
            setType(targetType);
            break;
          case 'nested':
            setNestedType(targetType);
            break;
          case 'scalar':
            setScalarType(targetType);
            break;
        }
      }
      setIsQueryOpen(false);
      setIsFieldOpen(false);
    }
  };

  const getArgs = (args: Args[], position: 'type' | 'fields') =>
    args.map((item) => (
      <div key={item.name} className="argument">
        <span>{item.name}</span>:{' '}
        {item.type.kind === 'NON_NULL' && item.name !== 'ids' ? (
          <span>
            <a
              onClick={(e) => {
                handleClickType(e, 'scalar');
                field && position === 'type' ? setHeader(field.name) : setHeader(query[0].name);
              }}
            >
              {item.type.ofType.name}
            </a>
            !
          </span>
        ) : item.type.kind === 'NON_NULL' && item.name === 'ids' ? (
          <span>
            [
            <a
              onClick={(e) => {
                handleClickType(e, 'scalar');
                field && position === 'type' ? setHeader(field.name) : setHeader(query[0].name);
              }}
            >
              {item.type.ofType.ofType.ofType.name}
            </a>
            !]!
          </span>
        ) : item.type.kind === 'SCALAR' ? (
          <a
            onClick={(e) => {
              handleClickType(e, 'scalar');
              field && position === 'type' ? setHeader(field.name) : setHeader(query[0].name);
            }}
          >
            {item.type.name}
          </a>
        ) : (
          <a
            onClick={(e) => {
              handleClickType(e, 'nested');
              setIsNestedTypeOpen(true);
              field && position === 'type' ? setHeader(field.name) : setHeader(query[0].name);
            }}
          >
            {item.type.name}
          </a>
        )}
      </div>
    ));

  const handleClickDetails = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.target instanceof HTMLAnchorElement) {
      const value = event.target.innerText;

      if (type) {
        const details =
          type.inputFields !== null
            ? type.inputFields.find((el) => el.name === value)
            : type.fields.find((el) => el.name === value);
        details && setFieldDetails(details);
        return;
      }
      if (nestedType) {
        const details = nestedType.inputFields
          ? nestedType.inputFields.find((el) => el.name === value)
          : nestedType.fields.find((el) => el.name === value);
        details && setFieldDetails(details);
      }
    }
  };

  let fields: Field[] | null = null;
  if (nestedType) {
    fields = nestedType.fields ? nestedType.fields : nestedType.inputFields;
  }

  const docsOpen =
    !isQueryOpen &&
    !isFieldOpen &&
    !isTypeOpen &&
    !isNestedTypeOpen &&
    !scalarType &&
    !isFieldDetailsOpen;

  return (
    <>
      {docsOpen ? (
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
              <a onClick={() => handleClickField(el)}>{el.name}</a>({getArgs(el.args, 'fields')}
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
          {getArgs(field.args, 'type')}
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
                    <a
                      onClick={(e) => {
                        handleClickDetails(e);
                        setIsTypeOpen(false);
                        setIsNestedTypeOpen(false);
                        setIsFieldDetailsOpen(true);
                        setHeader(type.name);
                      }}
                    >
                      {el.name}
                    </a>
                    :{' '}
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
          {(nestedType.fields || nestedType.inputFields) && fields ? (
            <>
              <p>▪ Fields</p>
              {fields.map((el: Field) => (
                <div key={el.name}>
                  <p>
                    <a
                      onClick={(e) => {
                        handleClickDetails(e);
                        setIsTypeOpen(false);
                        setIsNestedTypeOpen(false);
                        setIsFieldOpen(false);
                        setIsFieldDetailsOpen(true);
                        setHeader(nestedType.name);
                      }}
                    >
                      {el.name}
                    </a>
                    :{' '}
                    {el.type.kind === 'NON_NULL' ? (
                      <span>
                        [
                        <a
                          onClick={(e) => {
                            handleClickType(e, 'nested');
                            setIsTypeOpen(false);
                            setIsNestedTypeOpen(true);
                            setHeader(nestedType.name);
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
                            setHeader(nestedType.name);
                          }}
                        >
                          {el.type.ofType.name}
                        </a>
                        ]
                      </span>
                    ) : (
                      <a
                        onClick={(e) => {
                          handleClickType(e, 'scalar');
                          setIsNestedTypeOpen(false);
                          setHeader(nestedType.name);
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
            <p>{nestedType.description}</p>
          )}
        </>
      )}

      {isFieldDetailsOpen && fieldDetails && (
        <>
          <h4>{fieldDetails.name}</h4>
          {fieldDetails.description && <p>{fieldDetails.description}</p>}
          <p>▪ Type</p>
          {fieldDetails.type.kind === 'NON_NULL' ? (
            <span>
              [
              <a
                onClick={(e) => {
                  handleClickType(e, 'type');
                  setIsTypeOpen(true);
                  setIsFieldDetailsOpen(false);
                  setHeader(fieldDetails.name);
                }}
              >
                {fieldDetails.type.ofType.ofType.name}
              </a>
              ]!
            </span>
          ) : fieldDetails.type.kind === 'LIST' ? (
            <span>
              [
              <a
                onClick={(e) => {
                  handleClickType(e, 'nested');
                  setIsNestedTypeOpen(true);
                  setIsFieldDetailsOpen(false);
                  setHeader(fieldDetails.name);
                }}
              >
                {fieldDetails.type.ofType.name}
              </a>
              ]
            </span>
          ) : fieldDetails.type.kind === 'OBJECT' ? (
            <a
              onClick={(e) => {
                handleClickType(e, 'nested');
                setIsNestedTypeOpen(true);
                setIsFieldDetailsOpen(false);
                setHeader(fieldDetails.name);
              }}
            >
              {fieldDetails.type.name}
            </a>
          ) : (
            <a
              onClick={(e) => {
                handleClickType(e, 'scalar');
                setIsFieldDetailsOpen(false);
                setHeader(fieldDetails.name);
              }}
            >
              {fieldDetails.type.name}
            </a>
          )}
        </>
      )}

      {scalarType && (
        <>
          <h4>{scalarType.name}</h4>
          {<p>{scalarType.description}</p>}
        </>
      )}
    </>
  );
};

export default Documentation;
