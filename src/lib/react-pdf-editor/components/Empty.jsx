import React from "react";
import { Segment, Header, Icon, Button } from "semantic-ui-react";

// interface Props {
//   loading: boolean;
//   uploadPdf: () => void;
// }

export default ({ loading, uploadPdf }) => (
  <Segment
    className="d-flex flex-column align-items-center py-5"
    // data-testid="empty-container"
    // placeholder
    loading={loading}
    // style={{ height: "80vh" }}
  >
    <Header icon>
      <Icon name="file pdf outline" />
      {/* Upload your PDF to start editing! */}
      Tải lên file pdf của bạn để bắt đầu chỉnh sửa
    </Header>
    <div>
      <Button
        primary
        data-testid="empty-screen-upload-pdf-btn"
        onClick={uploadPdf}>
        Tải PDF
      </Button>
    </div>
  </Segment>
);
