exports.success = (data) => {
    return { status: 'success', data }
}

exports.error = (data) => {
    return { status: 'error', data }
}