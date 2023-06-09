import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { DocsState, Field, QueryType } from '../../types/types';
import Arguments from './Arguments';
import { IconSquareDot } from '@tabler/icons-react';

type FieldsComponentProps = {
  parentState: DocsState;
  setParentState: Dispatch<SetStateAction<DocsState>>;
  query: QueryType[];
  handleClickType: (
    event: React.MouseEvent<HTMLAnchorElement>,
    type: 'type' | 'nested' | 'scalar'
  ) => void;
  handleClickField: (type: Field) => void;
};

const FieldsComponent = ({
  parentState,
  setParentState,
  query,
  handleClickType,
  handleClickField,
}: FieldsComponentProps) => {
  const { t } = useTranslation();

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    type: 'type' | 'nested' | 'scalar'
  ) => {
    handleClickType(event, type);
    setParentState((prev) => ({
      ...prev,
      isTypeOpen: true,
      header: query[0].name,
      field: null,
    }));
  };

  return (
    <>
      <p>{query[0].name}</p>
      <p className="header">
        <IconSquareDot size="1rem" stroke={2.3} /> {t('documentation.fields')}
      </p>
      {query[0].fields.map((el: Field) => (
        <div key={el.name} className="type">
          <a onClick={() => handleClickField(el)}>{el.name}</a>(
          <Arguments
            args={el.args}
            position="fields"
            parentState={parentState}
            setParentState={setParentState}
            query={query}
            handleClickType={handleClickType}
          />
          ):{' '}
          {el.type.kind === 'LIST' ? (
            <span>
              [
              <a className="info-link" onClick={(e) => handleClick(e, 'type')}>
                {el.type.ofType.name}
              </a>
              ]
            </span>
          ) : (
            <a className="info-link" onClick={(e) => handleClick(e, 'type')}>
              {el.type.name}
            </a>
          )}
          <p>{el.description}</p>
        </div>
      ))}
    </>
  );
};

export default FieldsComponent;
