<template>
    <HHeader
        theme="dark"
        class="app-header"
    >
        <div class="layout-logo" />
        <div class="header-right">
            <p>登录</p>
        </div>
    </HHeader>
</template>

<style lang="scss" scoped>
    .app-header {
        display: flex;

        .header-right {
            margin-left: auto;
            margin-right: 40px;
            display: grid;

            > * {
                margin: auto 0;
                cursor: pointer;
                transition: .3s;

                padding: 0 30px;

                &:hover {
                    color: #77A2DC;
                }
            }
        }
    }
</style>
