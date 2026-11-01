export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="mb-4 text-lg font-bold">{title}</h3>
        {children}
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}
