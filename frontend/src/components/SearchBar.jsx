import React from "react";
import PropTypes from "prop-types";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputBase from "@material-ui/core/InputBase";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import SearchIcon from "@material-ui/icons/SearchRounded";

import { gql, useLazyQuery } from "@apollo/client";
import { connect } from "react-redux";
import { showSnackbar } from "../state/actions";

const SEARCH = gql`
  query Search($keyword: String!) {
    search(keyword: $keyword) {
      id
      type
      content {
        ... on User {
          username
          fullname
        }
        ... on Group {
          id
          title
        }
        ... on Page {
          id
          title
        }
      }
    }
  }
`;

function renderInputComponent(props) {
  const { params, classes, loading, ...other } = props;

  return (
    <div>
      <InputBase
        fullWidth
        className={classes.searchBar}
        startAdornment={
          <React.Fragment>
            {loading ? (
              <CircularProgress
                className={classes.inputAdornment}
                color="inherit"
                size={20}
              />
            ) : (
              <SearchIcon className={classes.inputAdornment} color="action" />
            )}
          </React.Fragment>
        }
        inputProps={{ ...params.inputProps, autoComplete: "off" }}
        classes={{
          input: classes.input,
        }}
        ref={params.InputProps.ref}
        {...other}
      />
    </div>
  );
}

renderInputComponent.propTypes = {
  params: PropTypes.object,
  classes: PropTypes.object,
  loading: PropTypes.bool,
};

const useStyles = makeStyles((theme) => ({
  autoComplete: {
    flexGrow: "1",
  },
  searchBar: {
    borderRadius: "100px",
    backgroundColor: theme.palette.grey["200"],
    "&:hover": {
      backgroundColor: theme.palette.grey["100"],
    },
    "&:focus-within": {
      backgroundColor: theme.palette.background.default,
      boxShadow: `0 0 0px 2px ${theme.palette.primary.main}`,
    },
  },
  inputAdornment: {
    marginLeft: theme.spacing(1),
  },
  input: {
    padding: theme.spacing(1.25, 0, 0.75, 1),
  },
}));

function SearchBar(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const [search, { loading }] = useLazyQuery(SEARCH, {
    onCompleted({ search: results }) {
      setOptions(results);
    },
  });

  React.useEffect(() => {
    search({ variables: { keyword: query } });
  }, [query]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleInputChange = (event, value) => {
    setQuery(value);
  };

  return (
    <Autocomplete
      id={props.id}
      className={classes.autoComplete}
      open={open}
      loadingText="Loading..."
      noOptionsText="No results for this search"
      autoComplete
      autoHighlight
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onInputChange={handleInputChange}
      getOptionLabel={(option) => {
        if (option.type === "USER") {
          return option.content.fullname;
        } else if (option.type === "GROUP") {
          return option.content.title;
        }
        if (option.type === "PAGE") {
          return option.content.title;
        }
      }}
      options={options}
      loading={loading}
      inputValue={query}
      renderInput={(params) =>
        renderInputComponent({
          params,
          classes,
          loading, // TODO: must be passed through with params
          placeholder: props.placeholder,
          onFocus: props.onFocus,
          onBlur: props.onBlur,
        })
      }
      renderOption={(option, { inputValue }) => {
        if (option.type === "USER") {
          const userSuggestion = option.content.fullname;
          const userMatches = match(userSuggestion, inputValue);
          const userParts = parse(userSuggestion, userMatches);

          return (
            <Link
              component={RouterLink}
              to={`/profile/${encodeURIComponent(option.content.username)}/`}
            >
              <div>
                {userParts.map((part, index) => (
                  <span
                    key={index}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {part.text}
                  </span>
                ))}
              </div>
            </Link>
          );
        } else if (option.type === "GROUP") {
          const groupSuggestion = option.content.title;
          const groupMatches = match(groupSuggestion, inputValue);
          const groupParts = parse(groupSuggestion, groupMatches);

          return (
            <div>
              <Link
                component={RouterLink}
                to={`/group/${encodeURIComponent(option.content.id)}/`}
              >
                {groupParts.map((part, index) => (
                  <span
                    key={index}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {part.text}
                  </span>
                ))}
              </Link>
            </div>
          );
        }
        if (option.type === "PAGE") {
          const pageSuggestion = option.content.title;
          const pageMatches = match(pageSuggestion, inputValue);
          const pageParts = parse(pageSuggestion, pageMatches);

          return (
            <div>
              <Link
                component={RouterLink}
                to={`/page/${encodeURIComponent(option.content.id)}/`}
              >
                {pageParts.map((part, index) => (
                  <span
                    key={index}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {part.text}
                  </span>
                ))}
              </Link>
            </div>
          );
        }
      }}
    />
  );
}

SearchBar.propTypes = {
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

SearchBar.propTypes = {
  showSnackbar: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    showSnackbar: (variant, message) =>
      dispatch(showSnackbar(variant, message)),
  };
}

export default connect(null, mapDispatchToProps)(SearchBar);
