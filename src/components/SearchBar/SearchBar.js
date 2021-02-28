import React, { useState } from 'react';
import styled from 'styled-components';
import { Form, InputGroup, FormControl, Col, Dropdown } from 'react-bootstrap';

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

// local imports
import './SearchBar.css';

const FilterDiv = styled.div`
  height: 50px;
  color: var(--light);
  display: flex;
  justify-content: center;
  align-items: start;
  font-size: small;

  @media screen and (max-width: 991.9px) {
    height: 30px;
    font-size: x-small;
  }
`;

const SearchBar = ({ setParams, initFormState }) => {
  const [formData, setformData] = useState(initFormState);

  const handleChange = e => {
    const { name, value } = e.target;
    setformData(formData => ({ ...formData, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setParams(formData);
    window.scrollTo({ top: 205 });
  };

  const setSort = (orderBy, orderBySort, orderByName) => {
    setformData(formData => ({
      ...formData,
      order_by: orderBy,
      order_by_sort: orderBySort,
      orderByName,
    }));
    // set params that will be passed to ProductsList
    setParams({
      ...formData,
      order_by: orderBy,
      order_by_sort: orderBySort,
    });
    window.scrollTo({ top: 205 });
  };

  return (
    <Col md={10} className="SearchBar mx-auto">
      <Form className="SearchBar-Form mx-sm-5" onSubmit={handleSubmit}>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text className="bg-light px-1 px-sm-3 py-0 border border-secondary">
              <Dropdown>
                <Dropdown.Toggle
                  id="dropdown-sort"
                  variant="light"
                  size={'sm'}
                  aria-label="sorting options"
                >
                  <FontAwesomeIcon icon={faCogs} size="lg" />
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="border border-dark boxShadowSmall"
                  align="right"
                >
                  <Dropdown.Header className="text-info">
                    Sort by Price
                  </Dropdown.Header>
                  <Dropdown.Item
                    as="button"
                    type="button"
                    onClick={() => setSort('price', 'desc', 'High to Low')}
                    aria-label="price high to low"
                  >
                    <FontAwesomeIcon icon={faArrowDown} size="xs" />
                    {'  '}High to Low
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    type="button"
                    onClick={() => setSort('price', 'asc', 'Low to High')}
                    aria-label="price low to high"
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
                    aria-label="rating high to low"
                  >
                    <FontAwesomeIcon icon={faArrowDown} size="xs" />
                    {'  '}High to Low
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    type="button"
                    onClick={() => setSort('rating', 'asc', 'Low to High')}
                    aria-label="rating low to high"
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
                    aria-label="name A to Z"
                  >
                    <FontAwesomeIcon icon={faArrowDown} size="xs" />
                    {'  '}A to Z
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    type="button"
                    onClick={() => setSort('name', 'desc', 'Z to A')}
                    aria-label="name Z to A"
                  >
                    <FontAwesomeIcon icon={faArrowUp} size="xs" />
                    {'  '}Z to A
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    as="button"
                    type="button"
                    onClick={() => setSort('', '')}
                    aria-label="reset sorting to default"
                  >
                    <FontAwesomeIcon icon={faRecycle} size="xs" />
                    {'  '}Reset
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </InputGroup.Text>
          </InputGroup.Prepend>

          <FormControl
            id="query"
            name="query"
            placeholder="Search For..."
            onChange={handleChange}
            className="border border-secondary"
            aria-label="search query term"
          />

          <InputGroup.Append>
            <InputGroup.Text className="bg-primary text-light p-0 border border-secondary">
              <button
                className="btn-noStyle px-3 px-sm-5 py-1"
                type="submit"
                aria-label="Search"
              >
                <FontAwesomeIcon icon={faSearch} size="lg" />
              </button>
            </InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </Form>
      {/* Display for any filtering or ordering being applied to results */}
      <FilterDiv>
        {formData.order_by && (
          <div className="mb-1 bg-secondary px-2 rounded-bottom border border-dark border-top-0">
            <FontAwesomeIcon className="text-warning" icon={faFilter} />{' '}
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
