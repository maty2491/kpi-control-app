export const PageHeader = ({ eyebrow, title, description, aside }) => (
  <div className="page-header card border-0 shadow-sm mb-4">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
        <div>
          {eyebrow ? <div className="page-header__eyebrow">{eyebrow}</div> : null}
          <h1 className="h3 mb-1">{title}</h1>
          {description ? <p className="text-muted mb-0">{description}</p> : null}
        </div>
        {aside ? <div className="page-header__aside">{aside}</div> : null}
      </div>
    </div>
  </div>
);
