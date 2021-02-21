import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Form,
  InputGroup,
  FormControl,
  Col,
  Dropdown,
  DropdownButton,
} from 'react-bootstrap';

// fontawesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faCogs,
  faArrowDown,
  faArrowUp,
  faRecycle,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';

const FilterDiv = styled.div`
  height: 50px;
  color: var(--light);
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 991.9px) {
    height: 25px;
  }
`;

const SearchBar = ({ setParams, initFormState }) => {
  const [formData, setformData] = useState(initFormState.current);

  const handleChange = e => {
    const { name, value } = e.target;
    setformData(formData => ({ ...formData, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setParams(formData);
    console.log(formData);
  };

  const setSort = (orderBy, orderBySort, orderByName) => {
    setformData(formData => ({
      ...formData,
      order_by: orderBy,
      order_by_sort: orderBySort,
      orderByName,
    }));
    setParams(params => ({
      ...params,
      order_by: orderBy,
      order_by_sort: orderBySort,
    }));
  };

  return (
    <Col md={10} className="mx-auto">
      <Form className="mx-sm-5" onSubmit={handleSubmit}>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text className="bg-light text-dark px-1 px-sm-3 py-0">
              <DropdownButton
                id="dropdown-sort"
                title={<FontAwesomeIcon icon={faCogs} size="lg" />}
                variant="light"
                size={'sm'}
                drop="down"
                menuAlign="right"
              >
                <Dropdown.Header className="text-info">
                  Sort by Price
                </Dropdown.Header>
                <Dropdown.Item
                  as="button"
                  type="button"
                  onClick={() => setSort('price', 'desc', 'High to Low')}
                >
                  <FontAwesomeIcon icon={faArrowDown} size="xs" />
                  {'  '}High to Low
                </Dropdown.Item>
                <Dropdown.Item
                  as="button"
                  type="button"
                  onClick={() => setSort('price', 'asc', 'Low to High')}
                >
                  <FontAwesomeIcon icon={faArrowUp} size="xs" />
                  {'  '}Low to High
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header className="text-info">
                  Sort by Rating
                </Dropdown.Header>
                <Dropdown.Item
                  as="button"
                  type="button"
                  onClick={() => setSort('rating', 'desc', 'High to Low')}
                >
                  <FontAwesomeIcon icon={faArrowDown} size="xs" />
                  {'  '}High to Low
                </Dropdown.Item>
                <Dropdown.Item
                  as="button"
                  type="button"
                  onClick={() => setSort('rating', 'asc', 'Low to High')}
                >
                  <FontAwesomeIcon icon={faArrowUp} size="xs" />
                  {'  '}Low to High
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header className="text-info">
                  Sort by Name
                </Dropdown.Header>
                <Dropdown.Item
                  as="button"
                  type="button"
                  onClick={() => setSort('name', 'asc', 'A to Z')}
                >
                  <FontAwesomeIcon icon={faArrowDown} size="xs" />
                  {'  '}A to Z
                </Dropdown.Item>
                <Dropdown.Item
                  as="button"
                  type="button"
                  onClick={() => setSort('name', 'desc', 'Z to A')}
                >
                  <FontAwesomeIcon icon={faArrowUp} size="xs" />
                  {'  '}Z to A
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  as="button"
                  type="button"
                  onClick={() => setSort('', '')}
                >
                  <FontAwesomeIcon icon={faRecycle} size="xs" />
                  {'  '}Reset
                </Dropdown.Item>
              </DropdownButton>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            id="query"
            name="query"
            placeholder="Search For..."
            onChange={handleChange}
          />
          <InputGroup.Append>
            <InputGroup.Text className="bg-primary text-light p-0">
              <button className="btn-noStyle px-3 px-sm-5 py-1" type="submit">
                <FontAwesomeIcon icon={faSearch} size="lg" />
              </button>
            </InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </Form>
      <FilterDiv>
        {formData.order_by && (
          <div className="mb-1">
            <FontAwesomeIcon className="text-info" icon={faFilter} />{' '}
            <span>
              {formData.order_by.toUpperCase()}{' '}
              {formData.orderByName.toUpperCase()}
            </span>
          </div>
        )}
      </FilterDiv>
    </Col>
  );
};

export default React.memo(SearchBar);
