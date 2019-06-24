import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

const LoadingStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

class Loading extends PureComponent {
  render() {
    return (
      <LoadingStyles>
        <Typography variant="h5" gutterBottom>
          Loading Library
        </Typography>
        <CircularProgress variant="indeterminate" size={80} />
      </LoadingStyles>
    );
  }
}

export default Loading;
