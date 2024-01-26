import styled from '@emotion/styled';
import { forwardRef, useContext, useMemo } from 'react';
import { ISelectProps, Select } from '../select/Select';
import { DEFAULT_PAGINATION_PAGE_SIZES } from './Pagination.const';
import { PaginationContext } from './PaginationContext';

const StyledSelect = styled(Select)(
  ({ theme }) => `
    max-width: 71px;
    input {
        padding-left: 12px;
        padding-right: 8px;
    }

    input:not([type=hidden]) + div {
        /* TODO: use theme value */
        width: 20px;
    }
`
);

export type TPageSizeSelectOption = string;
export interface IPageSizeSelectProps extends Omit<ISelectProps, 'onChange' | 'data'> {
  onPageSizeChange: (pageSize: number) => void;
  pageSizes?: (number | TPageSizeSelectOption)[];
  className?: string;
}

/**
 * Component for selecting the desired page size for Pagination.
 * @requires this component to be a child of a Pagination component
 */
export const PageSizeSelect: React.FC<IPageSizeSelectProps> = forwardRef<HTMLInputElement, IPageSizeSelectProps>(
  ({ onPageSizeChange, pageSizes = DEFAULT_PAGINATION_PAGE_SIZES, ...selectProps }, selectRef) => {
    const { pageSize } = useContext(PaginationContext);

    const handlePageSizeChange = (val: string | string[]) => {
      onPageSizeChange(+val);
    };

    const options = useMemo(() => pageSizes.map((val) => `${val}`), [pageSizes]);

    return (
      <StyledSelect
        ref={selectRef}
        data={options}
        onChange={handlePageSizeChange}
        value={`${pageSize}`}
        className={selectProps.className}
      />
    );
  }
);
