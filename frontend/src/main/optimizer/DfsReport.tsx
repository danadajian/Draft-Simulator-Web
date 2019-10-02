import * as React from 'react';

interface rowAttributes {
    position: string,
    expected: number,
    actual: number,
    optimal: number,
    expected_v_actual: number,
    actual_v_optimal: number,
    expected_v_optimal: number
}

export const DfsReport = (props: {
    reportingData: rowAttributes[]}) =>
    <table>
        <tr>
            <th>Position</th>
            <th>Projected</th>
            <th>Actual</th>
            <th>Optimal</th>
            <th>Expected vs Actual</th>
            <th>Actual vs Optimal</th>
            <th>Expected vs Optimal</th>
        </tr>
        {props.reportingData.map(
            (row) => (
                <tr style={{fontWeight: (row.position === 'Total') ? 'bold' : 'normal'}}>
                    <td>{row.position}</td>
                    <td>{row.expected}</td>
                    <td>{row.actual}</td>
                    <td>{row.optimal}</td>
                    <td>{(100 * row.expected_v_actual).toFixed(2).toString().concat('%')}</td>
                    <td>{(100 * row.actual_v_optimal).toFixed(2).toString().concat('%')}</td>
                    <td>{(100 * row.expected_v_optimal).toFixed(2).toString().concat('%')}</td>
                </tr>
            )
        )}
    </table>;
