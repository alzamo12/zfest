import { formatDistanceToNow } from 'date-fns';
const NotificationModal = ({ notificationLoading, notifications, page, totalPages = 1, setPage, setIsOpen }) => {
    return (
        <dialog open className="modal modal-bottom sm:modal-middle">
            <form method="dialog" className="modal-box bg-base-100 shadow-xl">
                <h3 className="font-bold text-lg">Notifications</h3>

                {
                    notificationLoading ? <span className="loading loading-spinner loading-xl mx-auto"></span> :


                        <ul className="mt-4 space-y-3 max-h-80 overflow-y-auto">
                            {notifications?.notifications.length > 0 ? (
                                notifications?.notifications.map((n) => (
                                    <li
                                        key={n._id}
                                        className={`p-3 rounded-lg border ${n.seen
                                            ? "bg-base-200 text-base-content"
                                            : "bg-blue-100 text-blue-900 font-semibold"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p>{n.message}</p>
                                            {!n.seen && (
                                                <span className="badge badge-primary badge-sm">New</span>
                                            )}
                                        </div>
                                        <small className="text-xs text-gray-500">
                                            {formatDistanceToNow(new Date(n.createdAt), {
                                                addSuffix: true,
                                            })}
                                        </small>
                                    </li>
                                ))
                            ) : (
                                <p className="text-center py-6 text-sm text-gray-500">
                                    No notifications found.
                                </p>
                            )}
                        </ul>
                }

                {/* Pagination */}
                <div className="mt-4 flex justify-between items-center">
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            setPage((p) => Math.max(p - 1, 1))
                        }}
                        disabled={page === 1}
                        className="btn btn-sm btn-outline"
                    >
                        Prev
                    </button>
                    <span className="text-sm">Page {page} of {totalPages}</span>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            setPage((p) => Math.min(p + 1, totalPages))
                        }}
                        disabled={page === totalPages}
                        className="btn btn-sm btn-outline"
                    >
                        Next
                    </button>
                </div>

                {/* Close Button */}
                <div className="modal-action">
                    <button className="btn" onClick={() => setIsOpen(false)}>
                        Close
                    </button>
                </div>
            </form>
        </dialog>
    );
};

export default NotificationModal;