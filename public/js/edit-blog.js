const editFormHandler = async (event) => {
    try {
      event.preventDefault();
  
      const id = window.location.toString().split("/")[
        window.location.toString().split("/").length - 1
      ];
  
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
        body: JSON.stringify({
          blog_id: id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        document.location.replace("/dashboard");
      }
    } catch (err) {
      console.log(err);
      alert(response.statusText);
    }
  };
  
  document
    .querySelector(".edit-blog-btn")
    .addEventListener("click", editFormHandler);