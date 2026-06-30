import { useEffect, useState, useCallback } from "react";
import { Row, Col, Select, Pagination, Typography, Breadcrumb } from "antd";
import { useSearchParams } from "react-router-dom";
import { getProducts, getCategories, getBrands } from "../../api/index.js";
import ProductGrid from "../../components/product/ProductGrid.jsx";
import ProductFilter from "../../components/product/ProductFilter.jsx";
import { SORT_OPTIONS } from "../../constants/app.js";

const { Title } = Typography;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]         = useState([]);
  const [categories, setCategories]     = useState([]);
  const [brands, setBrands]             = useState([]);
  const [pagination, setPagination]     = useState({ page: 1, limit: 12, total: 0 });
  const [loading, setLoading]           = useState(false);
  const [sort, setSort]                 = useState("newest");

  const filters = {
    search:      searchParams.get("search") || undefined,
    category_id: searchParams.get("category_id") || undefined,
    brand_id:    searchParams.get("brand_id") || undefined,
    min_price:   searchParams.get("min_price") || undefined,
    max_price:   searchParams.get("max_price") || undefined,
  };

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await getProducts({ ...filters, sort, page, limit: pagination.limit });
      setProducts(data.data);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  }, [searchParams, sort]);

  useEffect(() => {
    Promise.all([getCategories({ active: true }), getBrands({ active: true })]).then(([c, b]) => {
      setCategories(c.data.data.categories);
      setBrands(b.data.data.brands);
    });
  }, []);

  useEffect(() => { fetchProducts(1); }, [fetchProducts]);

  const handleFilter = (f) => {
    const params = {};
    Object.entries(f).forEach(([k, v]) => { if (v) params[k] = v; });
    setSearchParams(params);
  };

  return (
    <div className="container page-section">
      <Breadcrumb items={[{ title: "Home", href: "/" }, { title: "Shop" }]} style={{ marginBottom: 16 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          {filters.search ? `Results for "${filters.search}"` : "All Products"}
          <span style={{ fontSize: 14, color: "#999", fontWeight: 400, marginLeft: 8 }}>
            ({pagination.total} items)
          </span>
        </Title>
        <Select value={sort} onChange={setSort} style={{ width: 160 }} options={SORT_OPTIONS} />
      </div>
      <Row gutter={[24, 0]}>
        <Col xs={0} sm={0} md={6} lg={5}>
          <ProductFilter categories={categories} brands={brands} filters={filters} onFilter={handleFilter} />
        </Col>
        <Col xs={24} sm={24} md={18} lg={19}>
          <ProductGrid products={products} loading={loading} />
          {pagination.total > pagination.limit && (
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Pagination
                current={pagination.page}
                pageSize={pagination.limit}
                total={pagination.total}
                onChange={(p) => fetchProducts(p)}
                showSizeChanger={false}
              />
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}
