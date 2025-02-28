# Release Info Action for Kitten Scientists

## Inputs

<!-- AUTO-DOC-INPUT:START - Do not remove or modify this section -->

|                             INPUT                              |  TYPE  | REQUIRED | DEFAULT |                                                                 DESCRIPTION                                                                  |
|----------------------------------------------------------------|--------|----------|---------|----------------------------------------------------------------------------------------------------------------------------------------------|
|    <a name="input_filename"></a>[filename](#input_filename)    | string |  false   |         | The name of the file <br>into which to write the <br>release info. Release info is <br>still printed to console if <br>`filename` is empty.  |
| <a name="input_repo-token"></a>[repo-token](#input_repo-token) | string |   true   |         |                                            Needs `secrets.GITHUB_TOKEN` to talk to <br>the API.                                              |

<!-- AUTO-DOC-INPUT:END -->
