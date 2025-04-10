import {
  reactExtension,
  Banner,
  BlockStack,
  InlineStack,
  InlineLayout,
  Text,
  useApi,
  useCartLines,
  ProductThumbnail,
  Button,
  Select,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

// Extension target
export default reactExtension("purchase.checkout.block.render", () => (
  <Upsell />
));

function Upsell() {
  const { query, applyCartLinesChange } = useApi();
  const cartLines = useCartLines();

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await query(`{
          products(first: 5, query: "tag:upsell") {
            edges {
              node {
                id
                title
                featuredImage { url }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      price { amount }
                    }
                  }
                }
              }
            }
          }
        }`);

        // Filter out products already in cart
        const filteredProducts = data.products.edges
          .map((edge) => edge.node)
          .filter((product) => !isProductInCart(product, cartLines));

        setProducts(filteredProducts);

        // Set default selected variant for each product
        const defaultSelectedVariants = {};
        filteredProducts.forEach((product) => {
          if (product.variants.edges.length > 0) {
            defaultSelectedVariants[product.id] =
              product.variants.edges[0].node.id;
          }
        });
        setSelectedVariants(defaultSelectedVariants);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchProducts();
  }, [cartLines]);

  const isProductInCart = (product, cartLines) => {
    return product.variants.edges.some((variant) =>
      cartLines.some((cartLine) => cartLine.merchandise.id === variant.node.id),
    );
  };

  const handleVariantChange = (productId, variantId) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variantId,
    }));
  };

  const addToCart = async (variantId) => {
    setLoading(true);
    try {
      if (cartLines.some((cartLine) => cartLine.merchandise.id === variantId)) {
        console.log("Product is already in cart.");
        return;
      }

      const result = await applyCartLinesChange({
        type: "addCartLine",
        merchandiseId: variantId,
        quantity: 1,
        attributes: [],
      });

      if (result.type === "error") {
        throw new Error(result.message);
      }

      console.log("Successfully added:", result);
    } catch (err) {
      console.error("Add to cart error:", err);
      setError(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <Banner status="critical">{error}</Banner>;

  return (
    <BlockStack spacing="loose">
      {products.length > 0 && (
        <Text size="large" alignment="center" emphasis="bold">
          MUST-HAVE ITEMS
        </Text>
      )}
      {products.map((product) => {
        const variants = product.variants.edges;
        const hasMultipleVariants = variants.length > 1;
        const hasOneVariant = variants.length === 1;

        return (
          <BlockStack key={product.id}>
            <InlineLayout
              spacing="loose"
              columns={["auto", "fill", "auto"]} // 3 columns: image | fill remaining | button
              blockAlignment="center"
            >
              {/* Image */}
              <BlockStack>
                <ProductThumbnail
                  source={product.featuredImage?.url}
                  border="none"
                />
              </BlockStack>

              {/* Title + Price */}
              <BlockStack spacing="none">
                <Text size="base" emphasis="bold">
                  {product.title}
                </Text>
                <Text size="base">
                  ${product.variants.edges[0]?.node?.price?.amount || "0.00"}
                </Text>
              </BlockStack>

              {/* Add to Cart Button */}
              {hasOneVariant ? (
                <BlockStack spacing="none">
                  <Button
                    size="slim"
                    onPress={() => addToCart(variants[0]?.node?.id)}
                  >
                    Add to Cart
                  </Button>
                </BlockStack>
              ) : null}
            </InlineLayout>

            {/* Conditional Rendering for Multiple Variants */}
            {hasMultipleVariants ? (
  <InlineLayout
    spacing="loose"
    columns={['fill', 'auto']} // Select takes full width, button keeps its size
    blockAlignment="center"
  >
    {/* Variant Selector */}
    <BlockStack>
      <Select
        label="Select Variant"
        value={selectedVariants[product.id] || ""}
        onChange={(value) => handleVariantChange(product.id, value)}
        options={variants.map(({ node }) => ({
          value: node.id,
          label: `${node.title} - $${node.price.amount}`,
        }))}
      />
    </BlockStack>

    {/* Add to Cart Button */}
    <BlockStack>
      <Button
        size="base"
        onPress={() => {
          const selectedVariantId = selectedVariants[product.id];
          if (selectedVariantId) addToCart(selectedVariantId);
          else alert("Please select a variant");
        }}
      >
        Add to Cart
      </Button>
    </BlockStack>
  </InlineLayout>
) : null}

          </BlockStack>
        );
      })}
    </BlockStack>
  );
}
