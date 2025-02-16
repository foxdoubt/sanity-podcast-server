export const postFeedGroqQuery = `*[_type == 'post']{
    title,
    description,
  }`;

export const showDescriptionQuery = `*[_type == 'show']{
  "description": introduction
}`;
