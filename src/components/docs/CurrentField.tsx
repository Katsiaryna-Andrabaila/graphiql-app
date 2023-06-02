import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { DocsState, QueryType } from '../../types/types';
import Arguments from './Arguments';
import { IconCircleDot, IconSquareDot } from '@tabler/icons-react';

type CurrentFieldProps = {
  parentState: DocsState;
  setParentState: Dispatch<SetStateAction<DocsState>>;
  query: QueryType[];
  handleClickType: (
    event: React.MouseEvent<HTMLAnchorElement>,
    type: 'type' | 'nested' | 'scalar'
  ) => void;
};

const CurrentField = ({
  parentState,
  setParentState,
  query,
  handleClickType,
}: CurrentFieldProps) => {
  const { t } = useTranslation();
  const { field } = parentState;

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    type: 'type' | 'nested' | 'scalar'
  ) => {
    handleClickType(event, type);
    field &&
      setParentState((prev) => ({
        ...prev,
        isTypeOpen: true,
        header: field.name,
      }));
  };

  return (
    field && (
      <>
        <h4>{field.name}</h4>
        <p>{field.description}</p>
        <p className="header">
          <IconCircleDot size="1rem" stroke={2.3} />
          {t('documentation.type')}
        </p>
        {field.type.kind === 'LIST' ? (
          <span>
            [<a onClick={(e) => handleClick(e, 'type')}>{field.type.ofType.name}</a>]
          </span>
        ) : (
          <a onClick={(e) => handleClick(e, 'type')}>{field.type.name}</a>
        )}
        <p className="header">
          <IconSquareDot size="1rem" stroke={2.3} /> {t('documentation.arguments')}
        </p>
        <Arguments
          args={field.args}
          position="type"
          parentState={parentState}
          setParentState={setParentState}
          query={query}
          handleClickType={handleClickType}
        />
      </>
    )
  );
};

export default CurrentField;
