import React from "react";
import PropTypes from "prop-types";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/SearchRounded";

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
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query)}`
      );
      const result = await response.json();

      if (active) {
        setLoading(false);
        setOptions(result);
      }
    })();

    return () => {
      active = false;
    };
  }, [query]);

  React.useEffect(() => {
    if (!open) {
      setLoading(false);
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
      onChange={(_event, value) => props.handleSuggestionSelected(value)}
      filterOptions={(options) => options}
      getOptionLabel={(option) => option.text}
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
        const suggestion = option.text;
        const matches = match(suggestion, inputValue);
        const parts = parse(suggestion, matches);

        return (
          <div>
            {parts.map((part, index) => (
              <span
                key={index}
                style={{ fontWeight: part.highlight ? 700 : 400 }}
              >
                {part.text}
              </span>
            ))}
          </div>
        );
      }}
    />
  );
}

SearchBar.propTypes = {
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  handleSuggestionSelected: PropTypes.func,
};

export default SearchBar;
