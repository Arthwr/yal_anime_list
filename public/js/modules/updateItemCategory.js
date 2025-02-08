export default async function updateItemCategory(categoryName, titleId) {
  try {
    const response = await fetch("/assign-category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoryName, titleId }),
    });

    if (!response.ok) {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        const errorMessage = errorData.error || response.statusText;
        throw new Error(errorMessage);
      }

      const errorPage = await response.text();
      document.documentElement.innerHTML = errorPage;
      throw new Error(`Failed to assign category "${categoryName}" to the title id "${titleId}"`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
