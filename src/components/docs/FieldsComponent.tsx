import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { DocsState, Field, QueryType } from '../../types/types';
import Arguments from './Arguments';

type Props = {
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
}: Props) => {
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
    <div>
      <p>{query[0].name}</p>
      <p>{`▪ ${t('documentation.fields')}`}</p>
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
              [<a onClick={(e) => handleClick(e, 'type')}>{el.type.ofType.name}</a>]
            </span>
          ) : (
            <a onClick={(e) => handleClick(e, 'type')}>{el.type.name}</a>
          )}
          <p>{el.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FieldsComponent;
