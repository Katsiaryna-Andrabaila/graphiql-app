import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { DocsState, QueryType } from '../../types/types';
import { IconCircleCheck } from '@tabler/icons-react';

type InitialComponentProps = {
  parentState: DocsState;
  setParentState: Dispatch<SetStateAction<DocsState>>;
  query: QueryType[];
};

const InitialComponent = ({ parentState, setParentState, query }: InitialComponentProps) => {
  const { isQueryOpen } = parentState;
  const { t } = useTranslation();

  return (
    <>
      <h3 className="docs">{t('documentation.docs')}</h3>
      <p>{t('documentation.docsDescription')}</p>
      <p className="header">
        <IconCircleCheck size="1rem" stroke={2.3} />
        {` ${t('documentation.rootTypes')}`}
      </p>
      <p>
        query:{' '}
        <a onClick={() => setParentState((prev) => ({ ...prev, isQueryOpen: !isQueryOpen }))}>
          {query[0].name}
        </a>
      </p>
    </>
  );
};

export default InitialComponent;
